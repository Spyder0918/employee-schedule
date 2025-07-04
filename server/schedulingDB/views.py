from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.contrib.auth.models import User
from datetime import datetime, timedelta
import secrets
from .models import User, Shift, Availability, PTORequest, ShiftSwap, PasswordResetToken
from .serializers import (
    UserSerializer, ShiftSerializer, AvailabilitySerializer, 
    PTORequestSerializer, ShiftSwapSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer
)

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.role == 'admin'

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        return obj.user == request.user

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email']

class ShiftViewSet(viewsets.ModelViewSet):
    queryset = Shift.objects.all()
    serializer_class = ShiftSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['user', 'role', 'location']
    search_fields = ['role', 'location']

    def get_queryset(self):
        queryset = Shift.objects.all()
        if self.request.user.role == 'employee':
            return queryset.filter(user=self.request.user)
        return queryset

    def perform_create(self, serializer):
        if self.request.user.role not in ['admin', 'manager']:
            raise permissions.PermissionDenied("Only admins and managers can create shifts")
        serializer.save()

    @action(detail=True, methods=['post'])
    def assign_user(self, request, pk=None):
        shift = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(id=user_id)
            shift.user = user
            shift.save()
            return Response(ShiftSerializer(shift).data)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class AvailabilityViewSet(viewsets.ModelViewSet):
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'date', 'is_available']

    def get_queryset(self):
        queryset = Availability.objects.all()
        if self.request.user.role == 'employee':
            return queryset.filter(user=self.request.user)
        return queryset

class PTORequestViewSet(viewsets.ModelViewSet):
    queryset = PTORequest.objects.all()
    serializer_class = PTORequestSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'status', 'type']

    def get_queryset(self):
        queryset = PTORequest.objects.all()
        if self.request.user.role == 'employee':
            return queryset.filter(user=self.request.user)
        return queryset

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        if request.user.role not in ['admin', 'manager']:
            return Response({'error': 'Only admins and managers can approve PTO requests'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        pto_request = self.get_object()
        pto_request.status = 'approved'
        pto_request.save()
        return Response(PTORequestSerializer(pto_request).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        if request.user.role not in ['admin', 'manager']:
            return Response({'error': 'Only admins and managers can reject PTO requests'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        pto_request = self.get_object()
        pto_request.status = 'rejected'
        pto_request.save()
        return Response(PTORequestSerializer(pto_request).data)

class ShiftSwapViewSet(viewsets.ModelViewSet):
    queryset = ShiftSwap.objects.all()
    serializer_class = ShiftSwapSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['from_user', 'to_user', 'status']

    def get_queryset(self):
        queryset = ShiftSwap.objects.all()
        if self.request.user.role == 'employee':
            return queryset.filter(from_user=self.request.user) | queryset.filter(to_user=self.request.user)
        return queryset

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        swap_request = self.get_object()
        if swap_request.to_user != request.user:
            return Response({'error': 'You can only accept swap requests assigned to you'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        swap_request.status = 'approved'
        swap_request.save()
        
        # Update the shift assignment
        shift = swap_request.shift
        shift.user = swap_request.to_user
        shift.save()
        
        return Response(ShiftSwapSerializer(swap_request).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        swap_request = self.get_object()
        if swap_request.to_user != request.user:
            return Response({'error': 'You can only reject swap requests assigned to you'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        swap_request.status = 'rejected'
        swap_request.save()
        return Response(ShiftSwapSerializer(swap_request).data)
    
class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
            
            # Generate a secure token
            token = secrets.token_urlsafe(32)
            expires_at = timezone.now() + timedelta(hours=24)
            
            # Create or update the reset token
            PasswordResetToken.objects.filter(user=user).delete()  # Remove any existing tokens
            reset_token = PasswordResetToken.objects.create(
                user=user,
                token=token,
                expires_at=expires_at
            )
            
            # Send email with reset link
            reset_url = f"http://localhost:3000/reset-password?token={token}"
            send_mail(
                'Password Reset Request',
                f'Click the following link to reset your password: {reset_url}\n\n'
                f'This link will expire in 24 hours.\n\n'
                f'If you did not request this password reset, please ignore this email.',
                'noreply@yourdomain.com',
                [email],
                fail_silently=False,
            )
            
            return Response(
                {"message": "Password reset instructions have been sent to your email."},
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            # Don't reveal that the user doesn't exist
            return Response(
                {"message": "If an account exists with this email, you will receive password reset instructions."},
                status=status.HTTP_200_OK
            )

class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['password']
        
        try:
            reset_token = PasswordResetToken.objects.get(token=token)
            
            if not reset_token.is_valid():
                return Response(
                    {"error": "Invalid or expired token."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update the user's password
            user = reset_token.user
            user.set_password(new_password)
            user.save()
            
            # Mark the token as used
            reset_token.is_used = True
            reset_token.save()
            
            return Response(
                {"message": "Password has been reset successfully."},
                status=status.HTTP_200_OK
            )
        except PasswordResetToken.DoesNotExist:
            return Response(
                {"error": "Invalid token."},
                status=status.HTTP_400_BAD_REQUEST
            )

from rest_framework import serializers
from .models import User, Shift, Availability, PTORequest, ShiftSwap, PasswordResetToken
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        try:
            validate_password(data['password'])
        except ValidationError as e:
            raise serializers.ValidationError({'password': list(e.messages)})
        return data

class ShiftSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )

    class Meta:
        model = Shift
        fields = ['id', 'user', 'user_id', 'start_time', 'end_time', 'role', 'location']

class AvailabilitySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )

    class Meta:
        model = Availability
        fields = ['id', 'user', 'user_id', 'date', 'is_available']

class PTORequestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )

    class Meta:
        model = PTORequest
        fields = ['id', 'user', 'user_id', 'start_date', 'end_date', 'type', 'status', 'reason']

class ShiftSwapSerializer(serializers.ModelSerializer):
    shift = ShiftSerializer(read_only=True)
    shift_id = serializers.PrimaryKeyRelatedField(
        queryset=Shift.objects.all(), source='shift', write_only=True
    )
    from_user = UserSerializer(read_only=True)
    from_user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='from_user', write_only=True
    )
    to_user = UserSerializer(read_only=True, allow_null=True)
    to_user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='to_user', write_only=True, allow_null=True, required=False
    )

    class Meta:
        model = ShiftSwap
        fields = ['id', 'shift', 'shift_id', 'from_user', 'from_user_id', 'to_user', 'to_user_id', 'status']

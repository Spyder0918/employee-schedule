from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import (
    UserViewSet, 
    ShiftViewSet, 
    AvailabilityViewSet, 
    PTORequestViewSet, 
    ShiftSwapViewSet,
    PasswordResetRequestView,
    PasswordResetConfirmView
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'shifts', ShiftViewSet)
router.register(r'availabilities', AvailabilityViewSet)
router.register(r'pto-requests', PTORequestViewSet)
router.register(r'shift-swaps', ShiftSwapViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('password-reset/request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]

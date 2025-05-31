from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import UserViewSet, ShiftViewSet, AvailabilityViewSet, PTORequestViewSet, ShiftSwapViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'shifts', ShiftViewSet)
router.register(r'availabilities', AvailabilityViewSet)
router.register(r'pto-requests', PTORequestViewSet)
router.register(r'shift-swaps', ShiftSwapViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]

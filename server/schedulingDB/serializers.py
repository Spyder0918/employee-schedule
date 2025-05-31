from rest_framework import serializers
from .models import User, Shift, Availability, PTORequest, ShiftSwap

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

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

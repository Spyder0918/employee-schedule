from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('employee', 'Employee'),
        ('manager', 'Manager'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='employee')

    def __str__(self):
        return self.username


class Shift(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    role = models.CharField(max_length=100)
    location = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user} - {self.start_time} to {self.end_time}"

class Availability(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.username} - {self.date} - {'Available' if self.is_available else 'Unavailable'}"

class PTORequest(models.Model):
    PTO_TYPE = (
        ('vacation', 'Vacation'),
        ('sick', 'Sick'),
        ('other', 'Other'),
    )
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    type = models.CharField(max_length=20, choices=PTO_TYPE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reason = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username} PTO: {self.start_date} to {self.end_date} ({self.status})"

class ShiftSwap(models.Model):
    shift = models.ForeignKey(Shift, on_delete=models.CASCADE)
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shift_swap_from')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shift_swap_to', null=True, blank=True)
    status = models.CharField(max_length=20, choices=PTORequest.STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.from_user.username} swap request for shift {self.shift.id} ({self.status})"

class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"Reset token for {self.user.username}"

    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at

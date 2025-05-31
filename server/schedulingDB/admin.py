from django.contrib import admin
from .models import User, Shift, Availability, PTORequest, ShiftSwap
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# Customize User admin to show 'role' field
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        (None, {'fields': ('role',)}),
    )
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')

admin.site.register(User, UserAdmin)
admin.site.register(Shift)
admin.site.register(Availability)
admin.site.register(PTORequest)
admin.site.register(ShiftSwap)

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')
django.setup()

from schedulingDB.models import User

# Create a test user
test_user = User.objects.create_user(
    username='testuser',
    email='test@example.com',
    password='testpass123',
    role='employee'
)
print(f"Created test user: {test_user.username} with email: {test_user.email}") 
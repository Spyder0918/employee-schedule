from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse

class ShiftTests(APITestCase):
    def test_get_shifts(self):
        url = reverse('shifts-list')  # Or hardcode the URL: '/api/shifts/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

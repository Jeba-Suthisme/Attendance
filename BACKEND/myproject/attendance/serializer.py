from rest_framework import serializers
from .models import Attendance

class AttendanceSerializer(serializers.ModelSerializer):
    intern_name = serializers.CharField(source='user.profile.name', read_only=True)
    intern_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'user', 'intern_name', 'intern_email', 'date', 'status']

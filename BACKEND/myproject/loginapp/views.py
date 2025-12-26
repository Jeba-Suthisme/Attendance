
from rest_framework import status
from django.contrib.auth.models import User
from .models import Profile
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import authentication_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.http import HttpResponse
from datetime import date
import csv
from attendance.models import Attendance
from attendance.serializer import AttendanceSerializer
from .permission import IsInternUserRole
from .serializer import ProfileSerializer

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def profile_view(request):
    profile = request.user.profile
    serializer = ProfileSerializer(profile)
    return Response(serializer.data)


@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"error": "Email and password required"}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "Invalid credentials"}, status=400)

    user = authenticate(username=user.username, password=password)
    if not user:
        return Response({"error": "Invalid credentials"}, status=400)

    
    token, created = Token.objects.get_or_create(user=user)

    return Response({
        "token": token.key,         
        "user_id": user.id,
        "name": user.profile.name,
        "email": user.email,
        "role": user.profile.role
    }, status=200)








# Mark attendance (only self)
@api_view(['POST'])

def intern_mark_attendance(request):
    status_value = request.data.get("status")
    if status_value not in ["present", "absent"]:
        return Response({"error": "Invalid status"}, status=400)

    attendance, created = Attendance.objects.get_or_create(
        user=request.user,
        date=date.today(),
        defaults={"status": status_value}
    )

    if not created:
        attendance.status = status_value
        attendance.save()

    return Response({"message": "Attendance marked"})


# Attendance history
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])

def intern_attendance_history(request):
    attendance = Attendance.objects.filter(user=request.user)
    serializer = AttendanceSerializer(attendance, many=True)
    return Response(serializer.data)



@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def intern_download_attendance(request):
    start_date = request.GET.get("start_date")
    end_date = request.GET.get("end_date")
    status_value = request.GET.get("status")

    attendance = Attendance.objects.filter(user=request.user)

    if start_date and end_date:
        attendance = attendance.filter(date__range=[start_date, end_date])
    if status_value:
        attendance = attendance.filter(status=status_value)

    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="my_attendance.csv"'

    writer = csv.writer(response)
    writer.writerow(["Date", "Status"])
    for record in attendance:
        writer.writerow([record.date, record.status])

    return response


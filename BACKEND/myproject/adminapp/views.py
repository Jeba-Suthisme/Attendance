from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
import csv
from loginapp.models import Profile
from attendance.models import Attendance
from attendance.serializer import AttendanceSerializer
from .serializer import AddInternSerializer
from  .permission import IsAdminUserRole
from django.http import HttpResponse

from datetime import date


@api_view(['POST'])
def create_admin(request):
    

    name = request.data.get("name")
    email = request.data.get("email")
    password = request.data.get("password")

    if not name or not email or not password:
        return Response({"error": "All fields are required"}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already exists"}, status=400)

   
    user = User.objects.create_user(
        username=email,
        email=email,
        password=password
    )

   
    Profile.objects.create(
        user=user,
        name=name,
        role="admin"
    )

    return Response({"message": "Admin created successfully"})


@api_view(['POST'])

def add_intern(request):
    serializer = AddInternSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Intern added successfully"})
    return Response(serializer.errors, status=400)


@api_view(['GET'])

def list_interns(request):
    interns = User.objects.filter(profile__role="intern")

    data = []
    for intern in interns:
        data.append({
            "id": intern.id,
            "name": intern.profile.name,
            "email": intern.email
        })

    return Response(data)

@api_view(['DELETE'])

def delete_intern(request, pk):
    try:
        intern = User.objects.get(id=pk, is_staff=False)
        user = User.objects.get(id=pk)
        user.delete()
        return Response({"message": "Intern deleted successfully"})
    except User.DoesNotExist:
        return Response({"error": "Intern not found"}, status=404)

@api_view(['GET'])
def download_interns(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="interns.csv"'

    writer = csv.writer(response)
    writer.writerow(['Name', 'Email'])

    interns = User.objects.filter(is_staff=False)
    for user in interns:
        writer.writerow([user.profile.name, user.email])

    return response

@api_view(['POST'])

def mark_attendance(request):
    intern_id = request.data.get("intern_id")
    status = request.data.get("status")

    try:
        intern = User.objects.get(id=intern_id, profile__role="intern")
    except User.DoesNotExist:
        return Response({"error": "Intern not found"}, status=404)

    attendance, created = Attendance.objects.get_or_create(
        user=intern,
        date=date.today(),
        defaults={"status": status}
    )

    if not created:
        attendance.status = status
        attendance.save()

    return Response({"message": "Attendance marked"})

@api_view(["GET"])

def attendance_list(request):
    attendances = Attendance.objects.select_related(
        "user", "user__profile"
    )
    serializer = AttendanceSerializer(attendances, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])

def delete_attendance(request, pk):
    Attendance.objects.filter(id=pk).delete()
    return Response({"message": "Attendance deleted"})



@api_view(['GET'])
def download_attendance(request):
    intern_id = request.GET.get('intern_id')
    status_filter = request.GET.get('status')

    attendance_qs = Attendance.objects.all()

    if intern_id and intern_id != "":
        attendance_qs = attendance_qs.filter(user__id=intern_id)

    if status_filter and status_filter != "":
        attendance_qs = attendance_qs.filter(status=status_filter)

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="attendance.csv"'

    writer = csv.writer(response)
    writer.writerow(['Intern Name', 'Email', 'Date', 'Status'])

    for att in attendance_qs:
        writer.writerow([
            att.user.profile.name if hasattr(att.user, "profile") else att.user.username,
            att.user.email,
            att.date,
            att.status
        ])

    return response

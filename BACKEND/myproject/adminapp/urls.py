from django.urls import path
from .views import (
    create_admin,
    add_intern,
    list_interns,
    mark_attendance,
    attendance_list,
    delete_attendance,
    download_attendance,
    delete_intern
)

urlpatterns = [
    
    path("create/", create_admin, name="create-admin"),

    
    path("interns/add/", add_intern, name="add-intern"),
    path("interns/", list_interns, name="list-interns"),

    
    path("attendance/mark/", mark_attendance, name="mark-attendance"),
    path("attendance/", attendance_list, name="attendance-list"),
    path("attendance/<int:pk>/delete/", delete_attendance, name="delete-attendance"),

    path("attendance/download/", download_attendance, name="download-attendance"),
    path("interns/<int:pk>/delete/", delete_intern, name="delete-intern"),

]

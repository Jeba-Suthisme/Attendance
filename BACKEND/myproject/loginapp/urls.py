from django.urls import path
from .views import (
    
    login_view,
    
    intern_mark_attendance,
    intern_attendance_history,
    intern_download_attendance,
    profile_view

)

urlpatterns = [
  
    path('login/', login_view, name='login'),
    
    path('profile/', profile_view, name='profile'),
    path("attendance/mark/", intern_mark_attendance, name="intern-mark-attendance"),
    path("attendance/", intern_attendance_history, name="intern-attendance-history"),
    path("attendance/download/", intern_download_attendance, name="intern-download-attendance"),
]


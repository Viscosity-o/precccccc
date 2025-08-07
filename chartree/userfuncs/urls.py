from django.contrib import admin
from django.urls import path,include
from . import views


urlpatterns = [
    path('api/user/<slug:slug>/', views.get_everything, name='get_user_by_slug'),
    path("api/donations/",views.donate,name="donate"),
    path("api/getnotifications/<slug:slug>",views.getnotis,name="noti"),
    

    
]
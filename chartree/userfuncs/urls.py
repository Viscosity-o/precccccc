from django.contrib import admin
from django.urls import path,include
from . import views


urlpatterns = [
    path('api/user/<slug:slug>/', views.get_user_by_slug, name='get_user_by_slug'),
    path("api/userfuncs/donate",views.donate,name="donate"),
    

    
]
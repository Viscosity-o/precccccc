from django.urls import path
from . import views

urlpatterns = [
    path('requests/', views.ngo_requests, name='ngo_requests'),
    path('requests/create/', views.create_ngo_request, name='create_ngo_request'),
]
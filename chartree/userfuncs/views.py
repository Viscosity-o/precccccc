from django.shortcuts import render,redirect
from django.http import HttpResponse,JsonResponse
from django.contrib import messages
from django.contrib.auth.models import User,auth
from django.contrib.auth import authenticate,logout
from auther.models import customuser
from django.utils.text import slugify
from django.contrib.auth.hashers import check_password
from datetime import datetime
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from userfuncs.models import donation
from datetime import date

@api_view(['GET'])
def get_user_by_slug(request, slug):
    try:
        user = customuser.objects.filter(userslug=slug).first()
        return Response({
            'userslug': user.userslug,
            'username': user.username
        })
    except customuser.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)



# @api_view(['POST'])
# @permission_classes([AllowAny])
def donate(request):
    pass

#     try:
#         # Handle file uploads
#         photos = request.FILES.getlist('photos')
        
#         # Process form data
#         title = request.POST.get('title')
#         description = request.POST.get('description')
#         quantity = request.POST.get('quantity')
#         contact_method = request.POST.get('contact_method')
#         availability = request.POST.get('availability')
#         category = request.POST.get('category')
        
#         # Validate required fields
#         if not all([title, description, quantity, category]) or not photos:
#             return JsonResponse(
#                 {'error': 'Missing required fields'}, 
#                 status=400
#             )
        
#         # Save files (example)
#         # photo_paths = []
#         # for photo in photos:
#         #     path = default_storage.save(f'donations/{photo.name}', photo)
#         #     photo_paths.append(path)
        
#         Donation=donation.objects.create(tag=category,title=title,quantity=quantity,submittedon=date.today,description=description,)
        
#         # Return success response
#         return JsonResponse({
#             'id': 1,  # Replace with actual ID from DB
#             'title': title,
#             'description': description,
#             'quantity': quantity,
#             'category': category,
#             'photos': photo_paths,
#             'status': 'pending',
#             'submitted_at': datetime.now().isoformat(),
#             'message': 'Donation created successfully'
#         }, status=201)
        
#     except Exception as e:
#         return JsonResponse(
#             {'error': str(e)}, 
#             status=500
#         )
# Create your views here.

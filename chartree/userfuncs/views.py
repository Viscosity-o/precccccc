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
from userfuncs.models import donation,notification
from datetime import date

@api_view(['GET'])
@permission_classes([AllowAny])
def get_everything(request, slug):
    try:

    #     {
    #   id: 3,
    #   categories: ["Toys", "Books"],
    #   condition: "Good",
    #   quantity: 8,
    #   description: "Children's toys and picture books",
    #   status: "Rejected",
    #   submissionDate: "2024-01-12",
    #   preferredLocation: "eastside",
    #   rejectionReason: "Items not suitable for current programs",
    #   photos: ["🧸", "📖"]
    # }
    #

        user = customuser.objects.filter(slug=slug).first()
        donations=donation.objects.filter(user=user)
        pendingApproval=donation.objects.filter(user=user,verified="Pending").count()
        acceptedDonations=donation.objects.filter(user=user,verified="Approved").count()
        dlist=[]
        for d in donations:
            dobject={}
            dobject['id']=d.id
            dobject['title']=d.title
            dobject['categories']=d.tag
            dobject['quantity']=d.quantity
            dobject['description']=d.description
            dobject['status']=d.verified
            dobject['submissionDate']=d.submittedon
          
            dlist.append(dobject)

        return Response({
            'userslug': user.slug,
            'username': user.username,
            'donations':dlist,
            'pendingApproval':pendingApproval,
            "acceptedDonations":acceptedDonations
        })
    except customuser.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)



@api_view(['POST'])
@permission_classes([AllowAny])
def donate(request):
    try:
        # Access form data
        photos = request.FILES.get('photos')
        category = request.data.get('category')
       
        quantity = request.data.get('quantity')
        description = request.data.get('description')
        title = request.data.get('title')
        slug = request.data.get('slug')
        user=customuser.objects.filter(slug=slug).first()
        
        # Validate required fields
        if not all([photos, category, quantity, description]):
            return Response(
                {'error': 'Missing required fields'},
                status=status.HTTP_400_BAD_REQUEST
            )
        Donation=donation.objects.create(tag=category,title=title,image=photos,quantity=quantity,user=user,verified="Pending",donated=False,recieved=False,submittedon=date.today(),description=description)
        return Response({'message': 'Donation submitted successfully'}, status=201)


    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@api_view(['GET'])
@permission_classes([AllowAny])
def getnotis(request,slug):
    
    user=customuser.objects.filter(slug=slug).first()
    
    notis=notification.objects.filter(user=user)
    
    rlist=[]
    for r in notis:
        robj={}
        robj["message"]=r.message
        robj['title']=r.title
        robj['type']=r.type
        rlist.append(robj)
    return Response({
        'notilist': rlist 
    })


from django.db import models
from django.contrib.auth.models import AbstractUser
import datetime

class customuser(AbstractUser):
    
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, blank=True, null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    slug=models.SlugField(blank=False,null=True)
    usertype=models.CharField(choices=[('user','user'),('ngo','ngo'),('admin','admin')],blank=False)  
    location=models.CharField(choices=[('Pune','Pune'),('Mumbai','Mumbai'),('Delhi','Delhi'),('Bengaluru','Bengaluru'),('Hyderabad','Hyderabad')],blank=True,null=True)  
    contact=models.CharField(max_length=12,blank=True)


class ngo(models.Model):
    user= models.OneToOneField(customuser, on_delete=models.CASCADE, primary_key=True)
    ngoid = models.CharField(max_length=100, blank=True, null=True)

from django.db import models
from auther.models import customuser,ngo
from datetime import date


class donation(models.Model):
    choices=[
        ('Home Essentials','Home Essentials'),
        ('Furniture','Furniture'),
        ('Clothing & Footwear','Clothing & Footwear'),
        ('Hygiene Essentials','Hygiene Essentials'),
        ('Education Supplies','Education Supplies'),
        ('Childcare and Toys','Childcare and Toys'),
        ('Medical Supplies','Medical Supplies'),
        ('Bedding & Shelter', 'Bedding & Shelter')
    ] 
    stats=[("Approved","Approved"),("Rejected","Rejected"),("Pending","Pending")]
    tag=models.CharField(choices=choices,default='Home Essentials',blank=False,null=False)
    title=models.CharField(max_length=50,blank=True,null=False,default="Null")
    image=models.ImageField(default="fallback.png",blank=True)
    quantity=models.IntegerField(default=1,blank=False,null=False)
    user=models.ForeignKey(customuser,on_delete=models.CASCADE)
    verified=models.CharField(choices=stats,default="Pending")
    donated=models.BooleanField(default=False)
    recieved=models.BooleanField(default=False)
    submittedon=models.DateField(default=date.today)
    description=models.CharField(blank=True,null=True)
    donationdate = models.DateField(default=date.today, blank=True, null=True)
    ngo=models.OneToOneField(ngo,on_delete=models.CASCADE,blank=True,null=True)
    rejectionReason=models.CharField(blank=True,null=True)

class notification(models.Model):
    user=models.ForeignKey(customuser,on_delete=models.CASCADE)
    type=models.CharField(choices=[('rejected','rejected'),('accepted','accepted'),('info','info')],default='info')
    title=models.CharField(max_length=50,blank=True,null=True,default="New Notification")
    message=models.TextField(blank=True,null=True)

# Create your models here.

from django.db import models
from datetime import datetime, timedelta
from django.core.mail import send_mail
import random


# Create your models here.
class User(models.Model):
    ROLES_CHOICES = [
        ("seller", "Seller"),
        ("customer", "Customer"),
    ]
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=128)
    role = models.CharField(max_length=15, choices=ROLES_CHOICES)
    validation_states = models.BooleanField(default=False)

    def _str_(self):
        return {self.email}







class Verification(models.Model):
    email = models.EmailField(unique=True)
    code = models.CharField(max_length=6, default=000000)
    expireTime = models.DateTimeField()

    def __str__(self):
        return f"{self.email} | {self.code} | expires: {self.expireTime}"

    def sendCode(self):
        send_mail(
            subject="Welcome to EasyTrade",
            message=f"Thank you for Registration\nYour verification code is: {self.code}\nThis Code is valid for 24 hours",
            from_email="noreply@myfundingplatform.com",
            recipient_list=[self.email],
            fail_silently=False,
        )

    def generateCode(self):
        self.code = random.randint(100000, 999999)
        self.expireTime = datetime.now() + timedelta(days=1)
        self.save()
from django.db import models

# Create your models here.
class MyClass(models.Model):
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=200)

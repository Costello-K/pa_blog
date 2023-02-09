from rest_framework import serializers

from .models import MyClass

class MyClassSerialiser(serializers.ModelSerializer):
    class Meta:
        model = MyClass
        fields = ['title', 'description']

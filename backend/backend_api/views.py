from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import MyClass
from .serializer import MyClassSerialiser
# Create your views here.


class MyClassView(APIView):
    def get(self, request):
        output = [
            {
                'title': el.title,
                'description': el.description
            } for el in MyClass.objects.all()
        ]
        return Response(output)

    def post(self, request):
        serialiser = MyClassSerialiser(data=request.data)
        if serialiser.is_valid(raise_exception=True):
            serialiser.save()
        return Response(serialiser.data)

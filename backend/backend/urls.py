"""Blog URLS Configuration"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

from .yasg import urlpatterns as doc_urls
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/jwt/create/', views.CustomTokenObtainPairView.as_view(), name='jwt-create'),
    path('auth/jwt/refresh/', views.CustomTokenRefreshView.as_view(), name='jwt-refresh'),
    path('auth/jwt/cookies/', views.Cookies.as_view(), name='cookies-jwt-delete'),
    path('auth/', include('djoser.urls')),
    path('v1/', include('backend_api.urls')),
]

urlpatterns += doc_urls

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

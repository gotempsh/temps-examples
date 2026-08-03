from django.urls import path
from django.http import JsonResponse


def home(request):
    return JsonResponse({"message": "Hello from Django on Temps!"})


def health(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("", home),
    path("health", health),
]

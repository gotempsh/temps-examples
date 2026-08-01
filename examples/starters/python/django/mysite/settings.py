import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Read the key from the environment, with a development-only fallback. A
# committed key is a committed key even when it says "insecure" — set
# SECRET_KEY in Temps for anything you actually deploy.
SECRET_KEY = os.environ.get("SECRET_KEY", "django-insecure-dev-only-do-not-deploy")

DEBUG = os.environ.get("DEBUG", "False") == "True"

ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "django.contrib.staticfiles",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = "mysite.urls"

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

WSGI_APPLICATION = "mysite.wsgi.application"

DATABASES = {}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

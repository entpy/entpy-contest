# -*- coding: utf-8 -*-

"""
Django settings for contest project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '=4)z)is^y_ktnbaja$&j-x^-xkk8sve_7yu3+0mzo+##s=%6ey'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []

# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'website',
    'django_user_agents',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django_user_agents.middleware.UserAgentMiddleware',
)

# postgreSQL
DATABASES = {
	'default': {
		'ENGINE': 'django.db.backends.postgresql_psycopg2',
		'NAME': 'entpy_contest',
		'USER': 'testuser',
		'PASSWORD': 'testuser',
		'HOST': '127.0.0.1',
		'PORT': '5432',
	}
}
"""

# MySQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'entpy_contest',
        'USER': 'testuser',
        'PASSWORD': 'testuser',
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }
}
"""

ROOT_URLCONF = 'contest.urls'

WSGI_APPLICATION = 'contest.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases
"""
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
"""

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Europe/Rome'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

# inside app
STATIC_URL = '/static/'

#inside project
STATICFILES_DIRS = (
	os.path.join(BASE_DIR, "static"), #inside project
)

TEMPLATE_DIRS = [os.path.join(BASE_DIR, 'templates')]

LOGGING = {
	'version': 1,
	'disable_existing_loggers': False,
	'handlers': {
		'file': {
			'level': 'DEBUG',
			'class': 'logging.FileHandler',
			'filename': '/tmp/debug.log',
		},
		'console' : {
			'class' : 'logging.StreamHandler',
			'level' : 'INFO',
			'stream' : 'ext://sys.stdout',
		},
	},
	'loggers': {
		'django.request': {
			'handlers': ['file'],
			'level': 'DEBUG',
			'propagate': True,
		},
	},
}

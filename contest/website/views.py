# -*- coding: utf-8 -*-

from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse, HttpRequest
from django.core.urlresolvers import reverse
from django.contrib import messages
import datetime
# include constants file
import logging

# Get an instance of a logger
logger = logging.getLogger('django.request')

def index(request):

        # list of all valid promotion (not expired) with type = frontend_post
        test = "test"

        context = {
                'test' : test,
        }

        return render(request, 'website/index.html', context)

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

        # cookie name
        cookie_name = "already_visited"

        # code via get
        code_to_check = False

        # Device properties
        device = request.user_agent.device  # returns Device(family='iPhone')

        # Accessing user agent's browser attributes
        browser = request.user_agent.browser  # returns Browser(family=u'Mobile Safari', version=(5, 1), version_string='5.1')

        # Operating System properties
        os = request.user_agent.os  # returns OperatingSystem(family=u'iOS', version=(5, 1), version_string='5.1')

        # default: setting animation type = none
        animation_type = "none_animation"

        if (
                ((browser.family == "Android") and (browser.version[0] >= 4)) or
                ((browser.family == "Firefox") and (browser.version[0] >= 25)) or
                ((browser.family == "Chrome") and (browser.version[0] >= 9)) or
                ((browser.family == "IE") and (browser.version[0] >= 10)) or
                ((browser.family == "Mobile Safari") and (browser.version[0] >= 4))
        ):
                animation_type = "advanced_animation"

        if (request.COOKIES.get(cookie_name) or code_to_check) :

                animation_type = "simple_animation"

        """
            SCELTA DEL TIPO DI ANIMAZIONE
            =============================

            Identific*zione dello useragent -> https://github.com/selwin/django-user_agents

            * impostare animation_type = advanced se:
                    il browser è android con versione >= 4
                    il browser è firefox con versione > 25
                    il browser è chrome con versione >= 9
                    il browser è mobile safari con versione >= 4

            * impostare animation_type = simple se:
                    ho già visitato la pagina (cookie presente) o sto arrivando con codice via GET

            * impostare animation_type = none in tutti gli altri casi
        """

        context = {
                'device' : device,
                'browser' : browser,
                'os' : os,
                'animation_type' : animation_type,
        }

        # create cookie
        response = render(request, 'website/index.html', context)

        response.set_cookie(cookie_name, "1", max_age=2419200) # 30 days expiring
        # response.set_cookie(cookie_name, "")

        return response

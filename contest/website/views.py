# -*- coding: utf-8 -*-

from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse, HttpRequest
from django.core.urlresolvers import reverse
from django.contrib import messages
from website.models import *
import datetime
# include constants file
import logging
import json

# Get an instance of a logger
logger = logging.getLogger('django.request')

def validate_code(request):
        """
        View to validate promotional code
        """

	code_to_validate = request.POST.get("code_to_validate", "")
        result = ""
        message = ""
        error = 0
        success = 0

        # retrieving promotion details
        promotionalcode_obj = PromotionalCode()

        # checking if code exists
        if (not error and not promotionalcode_obj.check_code_validity(code=code_to_validate, validity_check="exists")):
                result = "error"
                error = 1
                message = "Codice promozionale non esistente."

        # checking if code is not already validated
        if (not error and not promotionalcode_obj.check_code_validity(code=code_to_validate, validity_check="not_used")):
                result = "error"
                error = 1
                message = "Codice promozionale già validato."

        # checking if campaign is not expired
        if (not error and not promotionalcode_obj.check_code_validity(code=code_to_validate, validity_check="not_expired")):
                result = "error"
                error = 1
                message = "Codice promozionale scaduto."

        # code valid, retrieving promo details
        if (not error):
                success = 1
                promo_details = promotionalcode_obj.get_promo_details(code=code_to_validate)

        # return JSON response
        response_data = {}

        # build success/error response
        if (success):
                response_data['content'] = promo_details['content']
                response_data['code_type'] = promo_details['code_type']
                response_data['code_type_description'] = promo_details['code_type_description']
                response_data['expiring_in_days'] = promo_details['expiring_in_days']
        else if (error):
                response_data['content'] = message
                response_data['code_type'] = 'error_code'
                response_data['code_type_description'] = "Ops..."

        return HttpResponse(json.dumps(response_data), content_type="application/json")

def index(request, code_to_check):

        # cookie name
        cookie_name = "already_visited"

        # code via get
        # code_to_check = False

        # Device properties
        device = request.user_agent.device  # returns Device(family='iPhone')

        # Accessing user agent's browser attributes
        browser = request.user_agent.browser  # returns Browser(family=u'Mobile Safari', version=(5, 1), version_string='5.1')

        # Operating System properties
        os = request.user_agent.os  # returns OperatingSystem(family=u'iOS', version=(5, 1), version_string='5.1')

        # default: setting animation type = none
        animation_type = "none_animation"
	browser_type = "normal_browser"

        if (
                ((browser.family == "Android") and (browser.version[0] >= 4)) or
                ((browser.family == "Firefox") and (browser.version[0] >= 25)) or
                ((browser.family == "Chrome") and (browser.version[0] >= 9)) or
                ((browser.family == "Chromium") and (browser.version[0] >= 30)) or
                ((browser.family == "IE") and (browser.version[0] >= 10)) or
                ((browser.family == "Mobile Safari") and (browser.version[0] >= 4))
        ):
		animation_type = "advanced_animation"
		browser_type = "advanced_browser";

        if ((request.COOKIES.get(cookie_name) or code_to_check) and animation_type == "advanced_animation"):
                animation_type = "simple_animation"

	"""
		SCELTA DEL TIPO DI ANIMAZIONE
		=============================

		Identific*zione dello useragent -> https://github.com/selwin/django-user_agents

		* impostare animation_type = advanced_animation se:
			il browser è android con versione >= 4
			il browser è firefox con versione > 25
			il browser è chrome con versione >= 9
			il browser è mobile safari con versione >= 4

		* impostare animation_type = simple_animation se:
			ho già visitato la pagina (cookie presente) o sto arrivando con codice via GET
			e se advanced_animation è supportata

		* impostare animation_type = none_animation in tutti gli altri casi
	"""

	# debug only plz remove
	# animation_type = "advanced_animation"

        context = {
                'device' : device,
                'browser' : browser,
                'os' : os,
                'animation_type' : animation_type,
		'code_to_check' : code_to_check,
		'browser_type' : browser_type,
        }

        # create cookie
        response = render(request, 'website/index.html', context)

        response.set_cookie(cookie_name, "1", max_age=2419200) # 30 days expiring
        # response.set_cookie(cookie_name, "")

        return response

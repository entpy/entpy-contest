# -*- coding: utf-8 -*-

from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse, HttpRequest
from django.core.urlresolvers import reverse
from django.contrib import messages
from website.models import *
import datetime
# include constants file
import logging

# Get an instance of a logger
logger = logging.getLogger('django.request')

def validate_code(request):
        """
        Promotional code validation view
        """

	code_to_validate = request.POST.get("code_to_validate", "")
        error = 0
        success = 0
	promo_details = None

        # retrieving promotion details
        promotionalcode_obj = PromotionalCode()

        # checking if code exists
        if (not error and not promotionalcode_obj.check_code_validity(code=code_to_validate, validity_check="exists")):
                error = 1

        # checking if code is not already validated
        if (not error and not promotionalcode_obj.check_code_validity(code=code_to_validate, validity_check="not_used")):
                error = 2

        # checking if campaign is not expired
        if (not error and not promotionalcode_obj.check_code_validity(code=code_to_validate, validity_check="not_expired")):
                error = 3

        # code valid
        if (not error):
                success = 1
                # retrieving promo details
                promo_details = promotionalcode_obj.get_promo_details(code=code_to_validate)
                # wow...let's sending an email to admin
                promotionalcode_obj.send_email(code=code_to_validate)

        # build JSON response
        response_data = promotionalcode_obj.build_json_response(error, success, promo_details)

        return HttpResponse(response_data, content_type="application/json")

def index(request, code_to_check):
        """
        Main view to detect animation type
        """

        # retrieving animation and browser type
        promotionalcode_obj = PromotionalCode()
        browser_capabilities = promotionalcode_obj.detect_animation_type(request, code_to_check)

        # logger.info("device capabilities: " + str(browser_capabilities))

        context = {
                'device' : browser_capabilities["device"],
                'browser' : browser_capabilities["browser"],
                'os' : browser_capabilities["os"],
                'animation_type' : browser_capabilities["animation_type"],
		'browser_type' : browser_capabilities["browser_type"],
		'code_to_check' : code_to_check,
        }

        response = render(request, 'website/index.html', context)

        # create cookie
        response.set_cookie(browser_capabilities["cookie_name"], "1", max_age=2419200) # 30 days expiring

        return response

# -*- coding: utf-8 -*-

from website.models import *
from django import forms
from django.contrib.admin import widgets 

class ValidateCodeForm(forms.Form):
        """
        Form to validate a coupon code, this form is not related with any object
        """

        promo_code = forms.CharField(max_length=5, required=True)

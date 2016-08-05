# -*- coding: utf-8 -*-

from django.contrib import admin
from django.conf.urls import patterns
from django.contrib import admin, messages
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from django.template import RequestContext, loader
from website.models import *
from event_counter.admin import *
from website.forms import *
import logging

# Get logger instance
logger = logging.getLogger('django.request')

class PromotionalCodeAdmin(admin.ModelAdmin):

        # fileds in add/modify form
        fields = ('code', 'code_types', 'code_contents', 'expiring_date')

        # table list fields
        list_display = ('code', 'code_types', 'code_contents', 'already_used', 'creation_date', 'expiring_date', 'redeem_date')

        # URLs overwriting to add new admin views (with auth check and without cache)
        def get_urls(self):
                urls = super(PromotionalCodeAdmin, self).get_urls()
                my_urls = patterns('',
                        (r'^code_validator$', self.admin_site.admin_view(self.code_validator)),
                )

                # return custom URLs with default URLs
                return my_urls + urls

        def save_model(self, request, obj, form, change):
                """
                Overriding of "save_model" to generate a campaign code after
                promotion saving (only if not exists yet)
                """

                # generating a random promo code, only if not exists
                if (not obj.code):
                    promotionalcode_obj = PromotionalCode()
                    promo_code = promotionalcode_obj.generate_random_code()

                    # setting custom promo code
                    obj.code = promo_code

                obj.save()

        def code_validator(self, request):
                """
                Function to validate a coupon code
                """

                can_redeem = False
                promotion_details = {}

                if request.method == 'POST':
                        form = ValidateCodeForm(request.POST)

                        # cancel operation
                        if (request.POST.get("cancel", "")):
                                messages.add_message(request, messages.WARNING, 'Operazione annullata.')
                                return HttpResponseRedirect('/admin/website/promotionalcode/code_validator') # Redirect after POST

                        if form.is_valid():
                                post_code = request.POST.get("promo_code")

                                # retrieving promotion details
                                promotionalcode_obj = PromotionalCode()

                                # checking if code exists
                                if (not promotionalcode_obj.check_code_validity(code=post_code, validity_check="exists")):
                                        messages.add_message(request, messages.ERROR, 'Codice promozionale non esistente.')
                                        return HttpResponseRedirect('/admin/website/promotionalcode/code_validator') # Redirect after POST

                                # checking if code is not already validated
                                if (not promotionalcode_obj.check_code_validity(code=post_code, validity_check="not_used")):
                                        messages.add_message(request, messages.ERROR, 'Codice promozionale già validato.')
                                        return HttpResponseRedirect('/admin/website/promotionalcode/code_validator') # Redirect after POST

                                # checking if campaign is not expired
                                if (not promotionalcode_obj.check_code_validity(code=post_code, validity_check="not_expired")):
                                        messages.add_message(request, messages.ERROR, 'Codice promozionale scaduto.')
                                        return HttpResponseRedirect('/admin/website/promotionalcode/code_validator') # Redirect after POST

                                # user can redeem the code
                                can_redeem = True

                                # show promotion details
                                promotion_details = promotionalcode_obj.get_promo_details(code=post_code)

                                if (request.POST.get("redeem_code", "")):
                                        # redeem code and redirect to success page
                                        promotionalcode_obj.redeem_code(post_code)
                                        messages.add_message(request, messages.SUCCESS, 'Codice promozionale validato!')
                                        return HttpResponseRedirect('/admin/website/promotionalcode/code_validator') # Redirect after POST
                else:
                        form = ValidateCodeForm() # An unbound form

                context = {
                        'form' : form,
                        'redeem_code' : can_redeem,
                        'promotion_details' : promotion_details,
                        'title': "Validatore di codici",
                        'opts': self.model._meta,
                        'app_label': self.model._meta.app_label,
                }

                return render(request, 'admin/custom_view/code_validator.html', context)

class CodeTypeAdmin(admin.ModelAdmin):

        # table list fields
        list_display = ('code_type', 'description')

class CodeContentAdmin(admin.ModelAdmin):
        class Media:
                """
                js = (
                        '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js',
                        '/static/website/js/tiny_mce/tinymce.min.js',
                        '/static/website/js/tiny_mce/tinymce_settings.js',
                )*/
                """
        # table list fields
        list_display = ('description',)

admin.site.register(PromotionalCode, PromotionalCodeAdmin)
admin.site.register(CodeType, CodeTypeAdmin)
admin.site.register(CodeContent, CodeContentAdmin)
admin.site.register(Event, EventCounterAdmin)

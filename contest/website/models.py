# -*- coding: utf-8 -*-

from django.db import models
from django.utils import timezone
from django.core.mail import EmailMessage
import datetime, string, random, logging, sys
from datetime import datetime
import json

# force utf8 read data
reload(sys);
sys.setdefaultencoding("utf8")

# Get logger instance
logger = logging.getLogger('django.request')

class CodeType(models.Model):

	# promotion type selector for admin
	TYPES_SELECTOR = (
                ("tip_code", "Codice tip"),
                ("success_code", "Codice di successo"),
                ("alert_code", "Codice di allerta"),
                ("error_code", "Codice di errore"),
	)

	id_code_type = models.AutoField(primary_key=True)
	code_type = models.CharField("Tipo di codice", max_length=50, choices=TYPES_SELECTOR)
	description = models.CharField("Descrizione del tipo", max_length=100)

	class Meta:
		verbose_name = "Tipologia di codice"
		verbose_name_plural = "Tipologie di codice"

	# On Python 3: def __str__(self):
	def __unicode__(self):
		return self.description

class CodeContent(models.Model):
	id_code_content = models.AutoField(primary_key=True)
	content = models.TextField("Contenuto")
	description = models.CharField("Descrizione del contenuto", max_length=200)

	class Meta:
		verbose_name = "Contenuto del codice"
		verbose_name_plural = "Contenuti del codice"

	# On Python 3: def __str__(self):
	def __unicode__(self):
		return self.description

class PromotionalCode(models.Model):
	id_promotional_code = models.AutoField(primary_key=True)
	code_types = models.ForeignKey(CodeType, db_column="id_code_type", verbose_name="Tipo")
	code_contents = models.ForeignKey(CodeContent, db_column="id_code_content", verbose_name="Contenuto")
	code = models.CharField("Codice", max_length=20, blank=True)
	already_used = models.BooleanField("Codice già utilizzato", default=0)
	creation_date = models.DateField("Data di creazione", auto_now_add=True, blank=True, null=True)
	expiring_date = models.DateField("Data di scadenza", blank=True, null=True)
	redeem_date = models.DateField("Data di utilizzo", blank=True, null=True)

	class Meta:
		verbose_name = "Codice promozionale"
		verbose_name_plural = "Codici promozionali"

	# On Python 3: def __str__(self):
	def __unicode__(self):
		return str(self.code)

        def build_json_response(self, error, success, promo_details, code):
                """
                Function to generate a JSON response
                """

                response_data = {}

                # checking if code exists
                if (error == 1):
                        message = '<div class="tinymce_block"><h2>Codice promozionale non esistente.</h2><p class="entpy_software_container">Entpy software | <a data-mce-href="http://www.entpy.com" target="_blank" href="http://www.entpy.com" title="Entpy">www.entpy.com</a><br></p><p class="attribution">"abbiamo visto il futuro, lui non ancora"</p></div>'

                # checking if code is not already validated
                if (error == 2):
                        message = '<div class="tinymce_block"><h2>Codice promozionale già validato.</h2><p class="entpy_software_container">Entpy software | <a data-mce-href="http://www.entpy.com" target="_blank" href="http://www.entpy.com" title="Entpy">www.entpy.com</a><br></p><p class="attribution">"abbiamo visto il futuro, lui non ancora"</p></div>'

                # checking if campaign is not expired
                if (error == 3):
                        message = '<div class="tinymce_block"><h2>Codice promozionale scaduto.</h2><p class="entpy_software_container">Entpy software | <a data-mce-href="http://www.entpy.com" target="_blank" href="http://www.entpy.com" title="Entpy">www.entpy.com</a><br></p><p class="attribution">"abbiamo visto il futuro, lui non ancora"</p></div>'

                # build success/error response {{{
                if (success):
                        response_data['content'] = promo_details['content']
                        response_data['code'] = code
                        response_data['code_type'] = promo_details['code_type']
                        response_data['code_type_description'] = promo_details['code_type_description']
                        response_data['expiring_in_days'] = promo_details['expiring_in_days']
                elif (error):
                        response_data['content'] = message
                        response_data['code'] = code
                        response_data['code_type'] = 'error_code'
                        response_data['code_type_description'] = "Ops..."
                # build success/error response }}}

                return json.dumps(response_data)

	def generate_random_code(self, depth = 0):
		"""
		Generating a random promo code, if the generated code already
		exists, than recursively call this function to generate a new ones.
		Max recursion depth: 50
		"""
		# generating a random code
		random_code = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(5))
		try:
			# checking if code already exists
			PromotionalCode.objects.get(code=random_code)
			# than recall this function to generate a new ones
			if (depth < 50):
				random_code = PromotionalCode.generate_random_code(self, depth+1)
			else:
				logger.error("ATTENZIONE: non sono riuscito a generare un nuovo codice | depth level: " + str(depth))
				random_code = "PROMOCODE1"
		except (KeyError, PromotionalCode.DoesNotExist):
			# Yo!
			pass
		return random_code

        def check_code_validity(self, code, validity_check=None):
                """
                Function to check if a code is not used yet or if the
                promotion isn't expired
                Validity checks available:
                    - not_used
                    - not_expired
                    - exists
                """

                return_var = False
                code = code.upper()

                try:
                        promotionalcode_obj = PromotionalCode.objects.select_related().get(code=code)

                        if (validity_check == 'not_used'):
                                if (not promotionalcode_obj.already_used):
                                        return_var = True

                        if (validity_check == 'not_expired'):
                                if ((promotionalcode_obj.expiring_date is None) or (promotionalcode_obj.expiring_date >= datetime.now().date())):
                                        return_var = True

                        if (validity_check == 'exists'):
                                if (promotionalcode_obj.id_promotional_code):
                                        return_var = True

                except(KeyError, PromotionalCode.DoesNotExist):
                        # code not exists
                        pass

                return return_var

        def get_promo_details(self, code=None):
                """
                Function to retrieve all details about a promotional code.
                """

                campaign_details = {
                        "code" : "",
                        "content" : "",
                        "code_type" : "",
                        "code_type_description" : "",
                        "expiring_in" : "",
                        "expiring_in_days" : ""
                }

                promotionalcode_obj = None
                code = code.upper()

                try:
                        if (code):
                                promotionalcode_obj = PromotionalCode.objects.select_related().get(code=code)

                        if (promotionalcode_obj):
                                type = promotionalcode_obj.code_types
                                content = promotionalcode_obj.code_contents

                                campaign_details["code"] = promotionalcode_obj.code
                                campaign_details["content"] = content.content
                                campaign_details["code_type"] = type.code_type
                                campaign_details["code_type_description"] = type.description
                                campaign_details["expiring_in"] = promotionalcode_obj.expiring_date
                                campaign_details["expiring_in_days"] = promotionalcode_obj.get_expiring_in_days(campaign_details["expiring_in"])

                except(KeyError, PromotionalCode.DoesNotExist):
                        # id_campaign doesn't exists
                        pass

                return campaign_details

        def get_expiring_in_days(self, expiring_date=None):
                """
                Function to calculate expiring in between two date
                """

                return_var = None

                if (expiring_date):
                        return_var = (expiring_date - datetime.now().date()).days

                return return_var

        def redeem_code(self, code):
                """
                Function to redeem a coupon code
                """

                return_var = False
                code = code.upper()

                try:
                        # setting code status = 1 (code used)
                        promotionalcode_obj = PromotionalCode.objects.get(code=code)
                        promotionalcode_obj.already_used = 1
                        promotionalcode_obj.redeem_date = datetime.now().date()
                        promotionalcode_obj.save()
                        return_var = True

                except(KeyError, PromotionalCode.DoesNotExist):
                        # code not exists
                        pass

                return return_var

        def build_promo_details_email(self, code=None, main_title=None):
                """
                Function to build an html email body with promotion details
                """

                return_var = ""
                promotionalcode_obj = PromotionalCode()

                if (code is not None):
                        # retrieving code data
                        promo_details = promotionalcode_obj.get_promo_details(code)

                        # building email body
                        if (main_title):
                            return_var = "<b>Entpy contest:</b> " + main_title + "<br /><br />"
                        else:
                            return_var = "<b>Entpy contest:</b> è stato validato un codice.<br /><br />"

                        return_var += "<b>Codice:</b> " + str(promo_details["code"]) + "<br />"
                        return_var += "<b>Tipo di codice:</b> " + str(promo_details["code_type"]) + "<br />"
                        return_var += "<b>Titolo:</b> " + str(promo_details["code_type_description"]) + "<br />"
                        return_var += "<b>Descrizione:</b> " + str(promo_details["content"]) + "<br />"

                        # print expiring in string
                        if (promo_details["expiring_in_days"] is not None):
                                if (promo_details["expiring_in_days"] == 0):
                                        return_var += "<b>Scadenza:</b> scade OGGI<br />"
                                elif (promo_details["expiring_in_days"] == 1):
                                        return_var += "<b>Scadenza:</b> Scade domani<br />"
                                elif (promo_details["expiring_in_days"] > 1):
                                        return_var += "<b>Scadenza:</b> scade tra " + str(promo_details["expiring_in_days"]) + " giorni<br />"

                return return_var

        def build_info_email_body(self, content=None, email=None, code=None):
                """
                Function to build an html email body with promotion details
                """

                return_var = ""
                promotionalcode_obj = PromotionalCode()

                if (content is not None and email is not None):

                        return_var = "<b>Entpy contest:</b> <br /><br />"

                        # building email body
                        if (code is not None):
                                # retrieving code data
                                promo_details = promotionalcode_obj.get_promo_details(code)
                                return_var = promotionalcode_obj.build_promo_details_email(code=promo_details["code"], main_title="Richiesta informazioni da Entpy contest")

                        return_var += "<b>Email da contattare:</b>" + email + "<br />"
                        return_var += "<b>Testo inserito:</b><br /><div>" + content + "</div><br />"

                return return_var

        def send_email(self, mail_body=None, mail_subject=None):
                """
                Function to send an email
                """

                return_var = False

                # subject | body | from email | to email
                msg = EmailMessage(mail_subject, mail_body, 'contest@entpy.com', ['contest@entpy.com'])
                msg.content_subtype = "html"  # Main content is now text/html
                msg.send()
                return_var = True

                return return_var

        def detect_animation_type(self, request=None, code_to_check=None):
                """
                Function to detect animation type -> (simple_animation | advanced_animation | none_animation) 
                and browser type -> (normal_browser | advanced_browser)

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

                return_var = {
                        'device' : "",
                        'browser' : "",
                        'os' : "",
                        'animation_type' : "",
                        'browser_type' : "",
                        'cookie_name' : "already_visited" # cookie name
                }

                if (request):
                        # Device properties
                        device = request.user_agent.device  # returns Device(family='iPhone')

                        # Accessing user agent's browser attributes
                        browser = request.user_agent.browser  # returns Browser(family=u'Mobile Safari', version=(5, 1), version_string='5.1')

                        # Operating System properties
                        os = request.user_agent.os  # returns OperatingSystem(family=u'iOS', version=(5, 1), version_string='5.1')

                        # default: setting animation type = none
                        animation_type = "none_animation"
                        browser_type = "normal_browser"

                        # log debug
                        logger.debug("######## browser details {{{ ##########")
                        logger.debug("device: " + str(device))
                        logger.debug("browser: " + str(browser))
                        logger.debug("os: " + str(os))
                        logger.debug("######## browser details }}} ##########")

                        if (
                                # browser type
                                ((browser.family == "Firefox") and (browser.version[0] >= 25)) or
                                ((browser.family == "Chrome") and (browser.version[0] >= 9)) or
                                ((browser.family == "Chromium") and (browser.version[0] >= 30)) or
                                ((browser.family == "IE") and (browser.version[0] >= 10)) or
                                ((browser.family == "Mobile Safari") and (browser.version[0] >= 5)) or
                                ((browser.family == "Chrome Mobile") and (browser.version[0] >= 18)) or
                                # os type
                                ((os.family == "Android") and (os.version[0] >= 4))
                                #((os.family == "iOS") and (os.version[0] >= 5)) # TODO: check this
                        ):
                                animation_type = "advanced_animation"
                                browser_type = "advanced_browser"

                        if ((request.COOKIES.get(return_var["cookie_name"]) or code_to_check) and animation_type == "advanced_animation"):
                                animation_type = "simple_animation"

                        # debug only
                        # animation_type = "none_animation"
                        # browser_type = "normal_browser"

                        # return var data
                        return_var["device"] = device
                        return_var["browser"] = browser
                        return_var["os"] = os
                        return_var["animation_type"] = animation_type
                        return_var["browser_type"] = browser_type

                return return_var

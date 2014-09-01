# -*- coding: utf-8 -*-

# TODO
"""
	V funzione per creare un codice personalizzato
	V funzione per generare un codice random tenendo conto di eventuali conflitti
	V  admin custom form per creare codici (con contenuto, data di scadenza, tipo)

	V  funzione per validare un codice promozionale
	V  admin form per validare i codici promzionali
"""

from django.db import models
from django.utils import timezone
import datetime, string, random, logging, sys
from datetime import datetime

# force utf8 read data
reload(sys);
sys.setdefaultencoding("utf8")

# Get logger instance
logger = logging.getLogger('django.request')

class CodeType(models.Model):

	# promotion type selector for admin
	TYPES_SELECTOR = (
                ("tip_code", "Easter egg"),
                ("success_code", "Sito gratuito"),
                ("alert_code", "Sconto"),
	)

	id_code_type = models.AutoField(primary_key=True)
	code_type = models.CharField("Tipo di codice", max_length=100, choices=TYPES_SELECTOR)
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

	class Meta:
		verbose_name = "Contenuto del codice"
		verbose_name_plural = "Contenuti del codice"

	# On Python 3: def __str__(self):
	def __unicode__(self):
		return self.content

class PromotionalCode(models.Model):
	id_promotional_code = models.AutoField(primary_key=True)
	code_types = models.ForeignKey(CodeType, db_column="id_code_type", verbose_name="Tipo")
	code_contents = models.ForeignKey(CodeContent, db_column="id_code_content", verbose_name="Contenuto")
	code = models.CharField("Codice promozionale", max_length=5)
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

                campaign_details = {}
                promotionalcode_obj = None

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

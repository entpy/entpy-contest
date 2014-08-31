# -*- coding: utf-8 -*-

# TODO
"""
	  funzione per creare un codice personalizzato
	V funzione per generare un codice random tenendo conto di eventuali conflitti
	  admin custom form per creare codici (con contenuto, data di scadenza, tipo)

	  funzione per validare un codice promozionale
	  admin form per validare i codici promzionali

"""

from django.db import models
import datetime, string, random, logging, sys

# force utf8 read data
reload(sys);
sys.setdefaultencoding("utf8")

# Get an instance of a logger
logger = logging.getLogger('django.request')

class CodeType(models.Model):
	id_code_type = models.AutoField(primary_key=True)
	code_type = models.CharField("Tipo di codice", max_length=2)
	description = models.CharField("Descrizione del tipo", max_length=100)

	class Meta:
		verbose_name = "Tipologia di codice"
		verbose_name_plural = "Tipologie di codice"

	# On Python 3: def __str__(self):
	def __unicode__(self):
		return str(self.id_code_type)

class PromotionalCode(models.Model):
	id_promotional_code = models.AutoField(primary_key=True)
	code_types = models.ForeignKey(CodeType, db_column="id_code_type")
	code = models.CharField("Codice promozionale", max_length=5)
	already_used = models.BooleanField("Codice già utilizzato", default=0)
	creation_date = models.DateField("Data di creazione", blank=True, null=True)
	expiring_date = models.DateField("Data di scadenza", blank=True, null=True)
	redeem_date = models.DateField("Data di utilizzo", blank=True, null=True)

	class Meta:
		verbose_name = "Codice promozionale"
		verbose_name_plural = "Codici promozionali"

	# On Python 3: def __str__(self):
	def __unicode__(self):
		return str(self.id_promotional_code)

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

class CodeContent(models.Model):
	id_code_content = models.AutoField(primary_key=True)
	promotional_codes = models.ManyToManyField(PromotionalCode)
	content = models.CharField("Contenuto del codice promozionale", max_length=200)

	class Meta:
		verbose_name = "Contenuto del codice"
		verbose_name_plural = "Contenuti del codice"

	# On Python 3: def __str__(self):
	def __unicode__(self):
		return str(self.id_code_content)

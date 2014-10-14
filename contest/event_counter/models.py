from django.db import models

"""
ABOUT
=====
Event counter is a simple django app to count events

USAGE
-----

# object init
event_obj = Event()

# Create a new event to track
event_obj.create_event("Test event description", "test_event")

# Increment the metric by one
event_obj.track_event("test_event")

or increase counter by n

# Increment the metric by n
event_obj.track_event("test_event", 3)
"""

class Event(models.Model):
	id = models.AutoField(primary_key=True)
        name = models.CharField("Nome evento", max_length=50, blank=False)
        slug = models.CharField("Codice evento", max_length=50, blank=False)
	counter = models.IntegerField("Contatore", blank=True, default=0)
	update_date = models.DateTimeField("Data ultima modifica", auto_now=True, blank=True, null=True)

	# On Python 3: def __str__(self):
	def __unicode__(self):
		return self.name

	class Meta:
		verbose_name = "Evento"
		verbose_name_plural = "Eventi"

        def create_event(self, name=None, slug=None):
                """
                Function to add a new tracking event
                """

                return_var = False

                try:
                        event_obj = Event.objects.get(slug=slug)
                        # edit existing event, this is an update
                        if (name is not None and slug is not None):
                                event_obj.name = name
                                event_obj.save()
                                return_var = True

                except(KeyError, Event.DoesNotExist):
                        # event does not exists, creating a new one
                        if (name is not None and slug is not None):
                                event_obj = Event()
                                event_obj.name = str(name)
                                event_obj.slug = str(slug)
                                event_obj.save()
                                return_var = True

                return return_var

        def track_event(self, event_slug=None, counter=1):
                """
                Function to track an event (event.counter will be increased by counter)
                """

                return_var = False

                if (event_slug is not None):
                        try:
                                event_obj = Event.objects.get(slug=event_slug)
                                # track event
                                event_obj.counter = event_obj.counter + counter
                                event_obj.save()

                        except(KeyError, Event.DoesNotExist):
                                # sorry, event not found
                                pass

                return return_var

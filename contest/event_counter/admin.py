from django.contrib import admin

class EventCounterAdmin(admin.ModelAdmin):

        # table list fields
        list_display = ('name', 'slug', 'counter', 'update_date')

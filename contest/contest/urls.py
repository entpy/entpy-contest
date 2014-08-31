from django.conf.urls import patterns, include, url
from django.conf import settings
from django.conf.urls.static import static

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
	# frontend URLs
	url(r'^validate-code/$', 'website.views.validate_code', name='validate_code'),
	# admin URLs
	url(r'^admin/', include(admin.site.urls)),
	# coupon code via GET
	url(r'^(?P<code_to_check>\w*)/?$', 'website.views.index', name='index'),

) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

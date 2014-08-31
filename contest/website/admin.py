from django.contrib import admin
from website.models import CodeType, PromotionalCode, CodeContent

admin.site.register(CodeType)
admin.site.register(PromotionalCode)
admin.site.register(CodeContent)

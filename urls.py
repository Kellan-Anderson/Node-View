from django.urls import path
from django.contrib import admin
admin.autodiscover()

from . import views

urlpatterns = [
        path('',views.get_books, name='get_books')

]

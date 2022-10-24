from django_neomodel import admin as neo_admin
from .models import Book

class BookAdmin(dj_admin.ModelAdmin):
    list_display = ("title", "created")
neo_admin.register(Book, BookAdmin)

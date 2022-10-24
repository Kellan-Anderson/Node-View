from django.shortcuts import render
from django.http import HttpResponse
from .models import Book

def home(request):
    return HttpResponse("Hello World")

def get_books(request):
    context = {'books': Book.nodes.get()}
    return render(request, 'neo/books.html', context)


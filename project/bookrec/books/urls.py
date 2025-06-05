from django.urls import path
from . import views

urlpatterns = [
    path('', views.BookListView.as_view(), name='book-list'),
    path('<int:pk>/', views.BookDetailView.as_view(), name='book-detail'),
    path('genres/', views.GenreListView.as_view(), name='genre-list'),
    path('authors/', views.AuthorListView.as_view(), name='author-list'),
    path('search/', views.BookSearchView.as_view(), name='book-search'),
]
from rest_framework import generics, filters
from .models import Book, Author, Genre
from .serializers import BookSerializer, BookDetailSerializer, AuthorSerializer, GenreSerializer
from django_filters.rest_framework import DjangoFilterBackend

class BookListView(generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['genres__name', 'complexity', 'suitable_moods', 'personality_match']
    search_fields = ['title', 'author__name', 'description', 'themes']
    ordering_fields = ['title', 'published_date', 'created_at']

class BookDetailView(generics.RetrieveAPIView):
    queryset = Book.objects.all()
    serializer_class = BookDetailSerializer

class GenreListView(generics.ListAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

class AuthorListView(generics.ListAPIView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

class BookSearchView(generics.ListAPIView):
    serializer_class = BookSerializer
    
    def get_queryset(self):
        queryset = Book.objects.all()
        mood = self.request.query_params.get('mood')
        personality = self.request.query_params.get('personality')
        genre = self.request.query_params.get('genre')
        complexity = self.request.query_params.get('complexity')
        
        if mood:
            queryset = queryset.filter(suitable_moods=mood)
        if personality:
            queryset = queryset.filter(personality_match=personality)
        if genre:
            queryset = queryset.filter(genres__name=genre)
        if complexity:
            queryset = queryset.filter(complexity=complexity)
            
        return queryset
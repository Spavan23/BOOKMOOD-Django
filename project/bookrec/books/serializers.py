from rest_framework import serializers
from .models import Book, Author, Genre

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name', 'description']

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name', 'bio']

class BookSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)
    genres_list = serializers.SerializerMethodField()
    
    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'author_name', 'genres_list', 
            'description', 'cover_image', 'published_date', 
            'suitable_moods', 'themes', 'complexity', 'personality_match',
            'page_count', 'isbn', 'language'
        ]
    
    def get_genres_list(self, obj):
        return [genre.name for genre in obj.genres.all()]

class BookDetailSerializer(BookSerializer):
    author = AuthorSerializer(read_only=True)
    genres = GenreSerializer(many=True, read_only=True)
    
    class Meta(BookSerializer.Meta):
        fields = BookSerializer.Meta.fields + ['created_at', 'updated_at']
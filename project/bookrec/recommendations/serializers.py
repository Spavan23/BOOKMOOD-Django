from rest_framework import serializers
from .models import UserMood, UserPreference, Recommendation, UserBookInteraction
from books.serializers import BookSerializer

class UserMoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMood
        fields = ['id', 'user', 'mood', 'intensity', 'timestamp']
        read_only_fields = ['user', 'timestamp']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class UserPreferenceSerializer(serializers.ModelSerializer):
    favorite_genres_names = serializers.SerializerMethodField()
    
    class Meta:
        model = UserPreference
        fields = [
            'id', 'user', 'favorite_genres', 'favorite_genres_names',
            'preferred_complexity', 'personality_traits',
            'prefer_fiction', 'prefer_series', 'prefer_recent_books',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def get_favorite_genres_names(self, obj):
        return [genre.name for genre in obj.favorite_genres.all()]
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class RecommendationSerializer(serializers.ModelSerializer):
    book_details = BookSerializer(source='book', read_only=True)
    
    class Meta:
        model = Recommendation
        fields = [
            'id', 'user', 'book', 'book_details', 'score', 
            'reason', 'current_mood', 'is_read', 'created_at'
        ]
        read_only_fields = ['user', 'created_at']

class UserBookInteractionSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    
    class Meta:
        model = UserBookInteraction
        fields = ['id', 'user', 'book', 'book_title', 'interaction_type', 'rating', 'timestamp']
        read_only_fields = ['user', 'timestamp']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
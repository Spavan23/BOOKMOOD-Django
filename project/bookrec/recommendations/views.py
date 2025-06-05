from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import UserMood, UserPreference, Recommendation, UserBookInteraction
from books.models import Book
from .serializers import (
    UserMoodSerializer, UserPreferenceSerializer, 
    RecommendationSerializer, UserBookInteractionSerializer
)

class UserMoodCreateView(generics.CreateAPIView):
    queryset = UserMood.objects.all()
    serializer_class = UserMoodSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserMoodDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserMood.objects.all()
    serializer_class = UserMoodSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserMood.objects.filter(user=self.request.user)

class UserPreferenceView(generics.RetrieveUpdateAPIView):
    serializer_class = UserPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        obj, created = UserPreference.objects.get_or_create(user=self.request.user)
        return obj

class UserBookInteractionCreateView(generics.CreateAPIView):
    queryset = UserBookInteraction.objects.all()
    serializer_class = UserBookInteractionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RecommendationListView(generics.ListAPIView):
    serializer_class = RecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Recommendation.objects.filter(user=self.request.user)

class GetRecommendationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        mood = request.data.get('mood')
        if not mood:
            return Response(
                {"error": "Current mood is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Save the current mood
        UserMood.objects.create(
            user=request.user,
            mood=mood,
            intensity=request.data.get('intensity', 5)
        )
        
        # Get user preferences or use defaults
        try:
            preferences = UserPreference.objects.get(user=request.user)
        except UserPreference.DoesNotExist:
            # Default to medium complexity and creative personality if no preferences set
            preferences = None
        
        # Build query based on mood and preferences
        query = Q(suitable_moods=mood)
        
        if preferences:
            # Add personality match if available
            if preferences.personality_traits:
                query |= Q(personality_match=preferences.personality_traits)
            
            # Add complexity preference if available
            if preferences.preferred_complexity:
                query |= Q(complexity=preferences.preferred_complexity)
            
            # Filter by favorite genres if they exist
            if preferences.favorite_genres.exists():
                genre_ids = preferences.favorite_genres.values_list('id', flat=True)
                query &= Q(genres__id__in=genre_ids)
        
        # Get books matching the criteria
        matching_books = Book.objects.filter(query).distinct()
        
        # Create recommendations
        recommendations = []
        for book in matching_books[:10]:  # Limit to top 10
            # Calculate recommendation score (simplified algorithm)
            score = 50  # Base score
            
            # Mood match increases score
            if book.suitable_moods == mood:
                score += 20
            
            # Personality match increases score if preferences exist
            if preferences and book.personality_match == preferences.personality_traits:
                score += 15
            
            # Complexity match increases score if preferences exist
            if preferences and book.complexity == preferences.preferred_complexity:
                score += 10
            
            # Previous interactions can affect score
            interactions = UserBookInteraction.objects.filter(
                user=request.user, book=book
            )
            
            # If user previously liked the book, boost score
            if interactions.filter(interaction_type='like').exists():
                score += 5
            
            # Cap score at 100
            score = min(score, 100)
            
            # Generate reason for recommendation
            reason = f"This book matches your current {mood} mood"
            if preferences and book.personality_match == preferences.personality_traits:
                reason += f" and your {preferences.personality_traits} personality"
            
            # Create or update recommendation
            rec, created = Recommendation.objects.update_or_create(
                user=request.user,
                book=book,
                current_mood=mood,
                defaults={
                    'score': score,
                    'reason': reason,
                    'is_read': False
                }
            )
            recommendations.append(rec)
        
        # Return serialized recommendations
        serializer = RecommendationSerializer(
            sorted(recommendations, key=lambda x: x.score, reverse=True),
            many=True
        )
        return Response(serializer.data)
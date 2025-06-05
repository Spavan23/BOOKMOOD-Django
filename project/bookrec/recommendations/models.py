from django.db import models
from django.contrib.auth.models import User
from books.models import Book

class UserMood(models.Model):
    MOOD_CHOICES = [
        ('happy', 'Happy'),
        ('sad', 'Sad'),
        ('thoughtful', 'Thoughtful'),
        ('excited', 'Excited'),
        ('relaxed', 'Relaxed'),
        ('tense', 'Tense'),
        ('curious', 'Curious'),
        ('inspired', 'Inspired'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='moods')
    mood = models.CharField(max_length=50, choices=MOOD_CHOICES)
    intensity = models.IntegerField(default=5, help_text="Scale of 1-10")
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.mood} ({self.intensity})"
    
    class Meta:
        ordering = ['-timestamp']

class UserPreference(models.Model):
    COMPLEXITY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('challenging', 'Challenging'),
    ]
    
    PERSONALITY_TRAITS = [
        ('introvert', 'Introvert'),
        ('extrovert', 'Extrovert'),
        ('analytical', 'Analytical'),
        ('creative', 'Creative'),
        ('practical', 'Practical'),
        ('adventurous', 'Adventurous'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preference')
    favorite_genres = models.ManyToManyField('books.Genre', related_name='preferred_by')
    preferred_complexity = models.CharField(max_length=20, choices=COMPLEXITY_CHOICES, default='medium')
    personality_traits = models.CharField(max_length=100, choices=PERSONALITY_TRAITS, default='creative')
    
    # Reading preferences
    prefer_fiction = models.BooleanField(default=True)
    prefer_series = models.BooleanField(default=False)
    prefer_recent_books = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s preferences"

class Recommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recommendations')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='recommendations')
    score = models.FloatField(help_text="Recommendation score 0-100")
    reason = models.TextField(help_text="Why this book was recommended")
    current_mood = models.CharField(max_length=50, blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.book.title} for {self.user.username} ({self.score})"
    
    class Meta:
        ordering = ['-score']
        unique_together = ['user', 'book', 'current_mood']

class UserBookInteraction(models.Model):
    INTERACTION_TYPES = [
        ('view', 'Viewed'),
        ('save', 'Saved'),
        ('read', 'Read'),
        ('like', 'Liked'),
        ('dislike', 'Disliked'),
        ('rate', 'Rated'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='book_interactions')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='user_interactions')
    interaction_type = models.CharField(max_length=20, choices=INTERACTION_TYPES)
    rating = models.IntegerField(null=True, blank=True, help_text="Rating 1-5")
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} {self.interaction_type} {self.book.title}"
    
    class Meta:
        ordering = ['-timestamp']
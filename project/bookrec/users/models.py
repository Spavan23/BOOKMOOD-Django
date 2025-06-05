from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    PERSONALITY_TRAITS = [
        ('introvert', 'Introvert'),
        ('extrovert', 'Extrovert'),
        ('analytical', 'Analytical'),
        ('creative', 'Creative'),
        ('practical', 'Practical'),
        ('adventurous', 'Adventurous'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(blank=True)
    
    # Reading stats
    books_read = models.PositiveIntegerField(default=0)
    currently_reading = models.ForeignKey(
        'books.Book', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='current_readers'
    )
    
    # Personality assessment
    dominant_trait = models.CharField(
        max_length=50, 
        choices=PERSONALITY_TRAITS,
        blank=True, 
        null=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s profile"
from django.db import models

class Genre(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name

class Author(models.Model):
    name = models.CharField(max_length=200)
    bio = models.TextField(blank=True)
    
    def __str__(self):
        return self.name

class Book(models.Model):
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
    
    COMPLEXITY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('challenging', 'Challenging'),
    ]
    
    PERSONALITY_MATCH_CHOICES = [
        ('introvert', 'Introvert'),
        ('extrovert', 'Extrovert'),
        ('analytical', 'Analytical'),
        ('creative', 'Creative'),
        ('practical', 'Practical'),
        ('adventurous', 'Adventurous'),
    ]
    
    title = models.CharField(max_length=255)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='books')
    genres = models.ManyToManyField(Genre, related_name='books')
    description = models.TextField()
    cover_image = models.ImageField(upload_to='book_covers/', blank=True, null=True)
    published_date = models.DateField()
    
    # Recommendation factors
    suitable_moods = models.CharField(max_length=255, choices=MOOD_CHOICES)
    themes = models.CharField(max_length=255)
    complexity = models.CharField(max_length=20, choices=COMPLEXITY_CHOICES)
    personality_match = models.CharField(max_length=100, choices=PERSONALITY_MATCH_CHOICES)
    
    # Additional metadata
    page_count = models.PositiveIntegerField(default=0)
    isbn = models.CharField(max_length=13, blank=True)
    language = models.CharField(max_length=50, default='English')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']
import os
import django
import datetime

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookrec.settings')
django.setup()

from django.contrib.auth.models import User
from books.models import Genre, Author, Book
from recommendations.models import UserPreference
from users.models import UserProfile

def create_initial_data():
    print("Creating initial data...")
    
    # Create genres
    genres = [
        {"name": "Fantasy", "description": "Fiction with supernatural elements"},
        {"name": "Science Fiction", "description": "Fiction based on scientific discoveries and technology"},
        {"name": "Mystery", "description": "Fiction dealing with solving a crime or puzzle"},
        {"name": "Romance", "description": "Stories centered around romantic relationships"},
        {"name": "Thriller", "description": "Fiction with suspense, excitement, and high stakes"},
        {"name": "Historical Fiction", "description": "Fiction set in the past"},
        {"name": "Non-fiction", "description": "Factual works based on real events and information"},
        {"name": "Self-help", "description": "Books focused on self-improvement"},
        {"name": "Biography", "description": "Account of someone's life written by someone else"},
        {"name": "Poetry", "description": "Literary work with intense or heightened language"},
    ]
    
    created_genres = {}
    for genre_data in genres:
        genre, created = Genre.objects.get_or_create(
            name=genre_data["name"],
            defaults={"description": genre_data["description"]}
        )
        created_genres[genre_data["name"]] = genre
        if created:
            print(f"Created genre: {genre.name}")
    
    # Create authors
    authors = [
        {"name": "Jane Austen", "bio": "English novelist known for her six major novels"},
        {"name": "George Orwell", "bio": "English novelist, essayist, and critic"},
        {"name": "J.K. Rowling", "bio": "British author and philanthropist"},
        {"name": "Stephen King", "bio": "American author of horror, supernatural fiction, and fantasy"},
        {"name": "Agatha Christie", "bio": "English writer known for her detective novels"},
        {"name": "Haruki Murakami", "bio": "Japanese writer with surrealistic and melancholic works"},
        {"name": "Toni Morrison", "bio": "American novelist and professor"},
        {"name": "Yuval Noah Harari", "bio": "Israeli historian and professor"},
        {"name": "Michelle Obama", "bio": "American attorney and author, former First Lady"},
        {"name": "Malcolm Gladwell", "bio": "Canadian journalist and author"},
    ]
    
    created_authors = {}
    for author_data in authors:
        author, created = Author.objects.get_or_create(
            name=author_data["name"],
            defaults={"bio": author_data["bio"]}
        )
        created_authors[author_data["name"]] = author
        if created:
            print(f"Created author: {author.name}")
    
    # Create books
    books = [
        {
            "title": "Pride and Prejudice",
            "author": created_authors["Jane Austen"],
            "genres": [created_genres["Romance"], created_genres["Historical Fiction"]],
            "description": "The story follows the main character, Elizabeth Bennet, as she deals with issues of manners, upbringing, morality, education, and marriage in the society of the landed gentry of the British Regency.",
            "published_date": datetime.date(1813, 1, 28),
            "suitable_moods": "relaxed",
            "themes": "love, social status, marriage",
            "complexity": "medium",
            "personality_match": "introvert",
            "page_count": 432,
            "isbn": "9780141439518",
        },
        {
            "title": "1984",
            "author": created_authors["George Orwell"],
            "genres": [created_genres["Science Fiction"], created_genres["Thriller"]],
            "description": "A dystopian novel that presents a terrifying vision of our future, where the government, led by Big Brother, watches and controls everything, even people's thoughts.",
            "published_date": datetime.date(1949, 6, 8),
            "suitable_moods": "thoughtful",
            "themes": "totalitarianism, surveillance, control",
            "complexity": "challenging",
            "personality_match": "analytical",
            "page_count": 328,
            "isbn": "9780451524935",
        },
        {
            "title": "Harry Potter and the Philosopher's Stone",
            "author": created_authors["J.K. Rowling"],
            "genres": [created_genres["Fantasy"]],
            "description": "The first novel in the Harry Potter series, it follows Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday.",
            "published_date": datetime.date(1997, 6, 26),
            "suitable_moods": "happy",
            "themes": "magic, friendship, coming of age",
            "complexity": "easy",
            "personality_match": "adventurous",
            "page_count": 332,
            "isbn": "9780747532743",
        },
        {
            "title": "The Shining",
            "author": created_authors["Stephen King"],
            "genres": [created_genres["Thriller"]],
            "description": "The story follows Jack Torrance, his wife Wendy, and their five-year-old son Danny as they live in the Overlook Hotel, where Jack has accepted the position of winter caretaker.",
            "published_date": datetime.date(1977, 1, 28),
            "suitable_moods": "tense",
            "themes": "isolation, family, madness",
            "complexity": "medium",
            "personality_match": "introvert",
            "page_count": 447,
            "isbn": "9780307743657",
        },
        {
            "title": "Murder on the Orient Express",
            "author": created_authors["Agatha Christie"],
            "genres": [created_genres["Mystery"]],
            "description": "Detective Hercule Poirot investigates the murder of an American tycoon aboard the Orient Express train.",
            "published_date": datetime.date(1934, 1, 1),
            "suitable_moods": "curious",
            "themes": "mystery, justice, deception",
            "complexity": "medium",
            "personality_match": "analytical",
            "page_count": 256,
            "isbn": "9780062693662",
        },
        {
            "title": "Norwegian Wood",
            "author": created_authors["Haruki Murakami"],
            "genres": [created_genres["Romance"]],
            "description": "A nostalgic story of loss and burgeoning sexuality set in Tokyo during the late 1960s.",
            "published_date": datetime.date(1987, 8, 4),
            "suitable_moods": "sad",
            "themes": "love, loss, nostalgia",
            "complexity": "medium",
            "personality_match": "introvert",
            "page_count": 296,
            "isbn": "9780375704024",
        },
        {
            "title": "Beloved",
            "author": created_authors["Toni Morrison"],
            "genres": [created_genres["Historical Fiction"]],
            "description": "Set after the American Civil War, the novel tells the story of a family of former slaves whose Cincinnati home is haunted by a malevolent spirit.",
            "published_date": datetime.date(1987, 9, 2),
            "suitable_moods": "thoughtful",
            "themes": "slavery, trauma, motherhood",
            "complexity": "challenging",
            "personality_match": "analytical",
            "page_count": 324,
            "isbn": "9781400033416",
        },
        {
            "title": "Sapiens: A Brief History of Humankind",
            "author": created_authors["Yuval Noah Harari"],
            "genres": [created_genres["Non-fiction"]],
            "description": "A book that explores the history of the human species from the emergence of Homo sapiens to the present day.",
            "published_date": datetime.date(2011, 1, 1),
            "suitable_moods": "curious",
            "themes": "history, evolution, society",
            "complexity": "medium",
            "personality_match": "analytical",
            "page_count": 464,
            "isbn": "9780062316097",
        },
        {
            "title": "Becoming",
            "author": created_authors["Michelle Obama"],
            "genres": [created_genres["Biography"]],
            "description": "An intimate, powerful, and inspiring memoir by the former First Lady of the United States.",
            "published_date": datetime.date(2018, 11, 13),
            "suitable_moods": "inspired",
            "themes": "identity, public service, family",
            "complexity": "medium",
            "personality_match": "practical",
            "page_count": 448,
            "isbn": "9781524763138",
        },
        {
            "title": "Outliers: The Story of Success",
            "author": created_authors["Malcolm Gladwell"],
            "genres": [created_genres["Non-fiction"], created_genres["Self-help"]],
            "description": "The book examines the factors that contribute to high levels of success.",
            "published_date": datetime.date(2008, 11, 18),
            "suitable_moods": "curious",
            "themes": "success, opportunity, culture",
            "complexity": "medium",
            "personality_match": "practical",
            "page_count": 304,
            "isbn": "9780316017930",
        },
    ]
    
    for book_data in books:
        book, created = Book.objects.get_or_create(
            title=book_data["title"],
            defaults={
                "author": book_data["author"],
                "description": book_data["description"],
                "published_date": book_data["published_date"],
                "suitable_moods": book_data["suitable_moods"],
                "themes": book_data["themes"],
                "complexity": book_data["complexity"],
                "personality_match": book_data["personality_match"],
                "page_count": book_data["page_count"],
                "isbn": book_data["isbn"],
            }
        )
        
        if created:
            book.genres.set(book_data["genres"])
            print(f"Created book: {book.title}")
    
    # Create a test user
    test_user, created = User.objects.get_or_create(
        username="testuser",
        defaults={
            "email": "test@example.com",
            "is_staff": True,
        }
    )
    
    if created:
        test_user.set_password("password123")
        test_user.save()
        print(f"Created test user: {test_user.username}")
        
        # Create user profile
        profile, created = UserProfile.objects.get_or_create(
            user=test_user,
            defaults={
                "bio": "This is a test user profile",
                "dominant_trait": "creative",
            }
        )
        
        if created:
            print(f"Created user profile for: {test_user.username}")
        
        # Create user preferences
        preferences, created = UserPreference.objects.get_or_create(
            user=test_user,
            defaults={
                "preferred_complexity": "medium",
                "personality_traits": "creative",
                "prefer_fiction": True,
                "prefer_series": False,
                "prefer_recent_books": True,
            }
        )
        
        if created:
            # Add some favorite genres
            preferences.favorite_genres.add(
                created_genres["Fantasy"],
                created_genres["Science Fiction"],
                created_genres["Mystery"]
            )
            print(f"Created user preferences for: {test_user.username}")
    
    print("Initial data creation completed!")

if __name__ == "__main__":
    create_initial_data()
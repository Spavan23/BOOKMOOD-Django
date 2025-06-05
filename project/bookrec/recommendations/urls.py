from django.urls import path
from . import views

urlpatterns = [
    path('', views.RecommendationListView.as_view(), name='recommendation-list'),
    path('moods/', views.UserMoodCreateView.as_view(), name='mood-create'),
    path('moods/<int:pk>/', views.UserMoodDetailView.as_view(), name='mood-detail'),
    path('preferences/', views.UserPreferenceView.as_view(), name='user-preferences'),
    path('interactions/', views.UserBookInteractionCreateView.as_view(), name='book-interaction-create'),
    path('suggest/', views.GetRecommendationsView.as_view(), name='get-recommendations'),
]
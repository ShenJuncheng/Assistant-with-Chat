# voiceAssistant/urls.py
from django.urls import path
from .views import index, chat_with_gpt

urlpatterns = [
    path('', index, name='index'),
    path('chat-with-gpt/', chat_with_gpt, name='chat_with_gpt'),
]
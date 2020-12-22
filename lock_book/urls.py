from django.urls import path
from . import views

urlpatterns = [
    # Urls for loading pages.
    path('', views.index, name='index'),
    path('key_holder', views.key_holder, name='key_holder'),
    path('key_holder/', views.key_holder, name='key_holder'),
    path('login', views.login_view, name='login'),
    path('login/', views.login_view, name='login'),
    path('register', views.register, name='register'),
    path('register/', views.register, name='register'),
    path('logout', views.logout_view, name='logout'),
    path('logout/', views.logout_view, name='logout'),

    # Urls for API request.
    path('pass', views.new_pass, name='new_pass'),
    path('save', views.key_save, name='key_save'),
    path('delete', views.key_delete, name='key_delete'),
]
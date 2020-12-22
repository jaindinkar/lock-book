from django.db import models
from django.contrib.auth.models import AbstractUser

# For adding email as username. Changing the default user manager.
from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import ugettext_lazy as _


# Custom user manager
class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """
    def create_user(self, email, password, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)


# Create your models here.

# User model goes here>
class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email


# KeyHolder model goes here>
class Key(models.Model):

    # Attributes for Key holder>
    key_creator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="my_keys")
    site_addr = models.CharField(max_length=100, default=None)
    email_addr = models.CharField(max_length=100, default=None)
    user_name = models.CharField(max_length=50, default=None)
    password = models.CharField(max_length=20, default=None)
    comments = models.CharField(max_length=100, default=None)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return(f"\nKey Creator: {self.key_creator} \n WebSite: {self.site_addr} \n Reg.Email: {self.email_addr} \n Reg. UName: {self.user_name} \n Reg. Pass: {self.password} \n Comments: {self.comments} \n timestamp: {self.timestamp} \n")

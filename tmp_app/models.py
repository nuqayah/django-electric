from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from datetime import datetime



class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()

        return user
    
class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class TaskManager(models.Manager):

    def get_writable_by(self, user, task_id):
        try:
            return self.get(
                id=task_id,
                granted_access__user=user,
                granted_access__access_level__gte=AccessLevel.WRITE
            )
        except self.model.DoesNotExist:
            raise self.model.DoesNotExist(
                "Task not found or user does not have write access."
            )
        
    def create_with_access(self, user, title, description, is_done):

        task = self.create(title=title, description=description, is_done=is_done)

        TaskAccess.objects.create(
            task=task, 
            user=user, 
            access_level=AccessLevel.WRITE
        )

        return task



class Task(models.Model):
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_done = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    
    objects = TaskManager()



class AccessLevel(models.IntegerChoices):
    NONE = 0, 'None'
    READ = 10, 'Read'
    WRITE = 20, 'Write'


class TaskAccess(models.Model):
    id: int = models.AutoField(primary_key=True)
    task: Task = models.ForeignKey('Task', on_delete=models.CASCADE, related_name='granted_access')
    user: CustomUser = models.ForeignKey('CustomUser', on_delete=models.CASCADE)
    access_level: int = models.IntegerField(
        choices=AccessLevel.choices,
        default=AccessLevel.READ,
    )
    granted_at: 'datetime' = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['task', 'user'], name='unique_user_task_access')]


from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=200)
    tech_stack = models.CharField(max_length=200)
    description = models.TextField()
    is_featured = models.BooleanField(default=False)
    github_url = models.URLField(blank=True, null=True)
    image = models.ImageField(upload_to='project_thumbnails/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name}"

class Profile(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField()
    profile_pic = models.ImageField(upload_to='profile_pics/', default='default.jpg')

    def __str__(self):
        return self.name
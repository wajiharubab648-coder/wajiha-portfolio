from django.conf import settings
from django.contrib import messages
from django.core.mail import send_mail
from django.shortcuts import render, redirect
from .models import Profile, Project, Contact


def home(request):
    profile = Profile.objects.first()
    featured_projects = Project.objects.filter(is_featured=True)
    additional_projects = Project.objects.filter(is_featured=False)

    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        message = request.POST.get('message')

        # Database mein save (backup ke liye)
        if name and email and message:
            Contact.objects.create(name=name, email=email, message=message)

        subject = f"Portfolio Message from {name}"
        full_message = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"

        try:
            send_mail(
                subject=subject,
                message=full_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=['asgharwajiha7@gmail.com'],
                fail_silently=False,
            )
            messages.success(request, "Your message has been sent successfully!")
        except Exception as e:
            messages.error(request, f"Failed to send email. Error: {str(e)}")

        return redirect('home')

    context = {
        'profile': profile,
        'featured_projects': featured_projects,
        'additional_projects': additional_projects,
    }
    return render(request, 'home.html', context)


def about(request):
    profile = Profile.objects.first()
    return render(request, 'about.html', {'profile': profile})


def skills(request):
    return render(request, 'skills.html')


def education(request):
    return render(request, 'education.html')


def projects(request):
    featured_projects = Project.objects.filter(is_featured=True)
    additional_projects = Project.objects.filter(is_featured=False)
    return render(request, 'projects.html', {
        'featured_projects': featured_projects,
        'additional_projects': additional_projects,
    })


def contact(request):
    return render(request, 'contact.html')


def resume(request):
    return render(request, 'resume.html')
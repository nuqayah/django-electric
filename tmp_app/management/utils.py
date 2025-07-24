from django.contrib.auth import get_user_model


def create_user(email, password, stdout=None):
    User = get_user_model()

    if User.objects.filter(email=email).exists():
        if stdout:
            stdout.write(f"User '{email}' already exists.")
    else:
        User.objects.create_user(email=email, password=password)
        if stdout:
            stdout.write(f"user '{email}' created successfully.")

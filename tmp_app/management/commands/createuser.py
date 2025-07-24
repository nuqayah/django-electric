from django.core.management.base import BaseCommand
from tmp_app.management.utils import create_user


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('--email', type=str, default='web@gmail.com')
        parser.add_argument('--password', type=str, default='test')

    def handle(self, *args, **kwargs):
        email = kwargs['email']
        password = kwargs['password']
        create_user(email, password, self.stdout)

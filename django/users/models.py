from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    name = models.CharField(max_length=255, verbose_name="Nome", blank=False)
    cpf = models.CharField(max_length=11, unique=True, verbose_name="CPF")
    role = models.CharField(
        max_length=15,
        choices=[('Client', 'Cliente'), ('Organizer', 'Organizador')],
        default='Client',
        verbose_name="Papel"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Define o campo que o Django usará para autenticação
    EMAIL_FIELD = "email"
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ['email', 'cpf']

    def __str__(self):
        return self.username
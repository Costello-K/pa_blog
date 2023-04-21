from django.conf import settings as django_settings
from django.contrib.auth.tokens import default_token_generator
from djoser import email
from djoser import utils
from djoser.conf import settings


class ActivationEmail(email.ActivationEmail):
    """Class for sending an account activation email based on the DJOSER class"""
    # Override activation email template
    template_name = 'account_email_activation.html'

    def get_context_data(self):
        frontend_site_name = django_settings.FRONTEND_DOMAIN
        # ActivationEmail can be deleted
        context = super().get_context_data()

        user = context.get('user')
        context['frontend_site_name'] = frontend_site_name
        context['uid'] = utils.encode_uid(user.pk)
        context['token'] = default_token_generator.make_token(user)
        context['url'] = settings.ACTIVATION_URL.format(**context)
        return context


class PasswordResetEmail(email.PasswordResetEmail):
    """Class for sending a password reset email based on the DJOSER class"""
    # Override password reset email template
    template_name = 'account_password_reset.html'

    def get_context_data(self):
        frontend_site_name = django_settings.FRONTEND_DOMAIN
        # PasswordResetEmail can be deleted
        context = super().get_context_data()

        user = context.get('user')
        context['frontend_site_name'] = frontend_site_name
        context['uid'] = utils.encode_uid(user.pk)
        context['token'] = default_token_generator.make_token(user)
        context['url'] = settings.PASSWORD_RESET_CONFIRM_URL.format(**context)
        return context

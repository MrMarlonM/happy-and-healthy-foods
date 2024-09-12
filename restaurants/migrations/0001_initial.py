# Generated by Django 4.2.16 on 2024-09-12 08:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Restaurant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=255)),
                ('country', models.CharField(max_length=255)),
                ('image', models.ImageField(upload_to='images/')),
                ('short_description', models.TextField(max_length=500)),
                ('cuisine_type', models.CharField(choices=[('italian', 'Italian'), ('indian', 'Indian'), ('german', 'German'), ('japanese', 'Japanese'), ('chinese', 'Chinese'), ('thai', 'Thai'), ('mexican', 'Mexican'), ('greek', 'Greek'), ('french', 'French'), ('spanish', 'Spanish'), ('vietnamese', 'Vietnamese'), ('korean', 'Korean'), ('other', 'Other')], max_length=25)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]

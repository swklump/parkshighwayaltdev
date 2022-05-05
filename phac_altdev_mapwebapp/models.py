from django.db import models

# Create table
class ALIGN(models.Model):
    EMAIL = models.CharField(max_length=255)
    ORDER = models.IntegerField()
    LAT = models.CharField(max_length=255)
    LON = models.CharField(max_length=255)
    TEXTINPUT = models.CharField(max_length=255)


class INT(models.Model):
    EMAIL = models.CharField(max_length=255)
    LAT = models.CharField(max_length=255)
    LON = models.CharField(max_length=255)
    TEXTINPUT = models.CharField(max_length=255)
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.home, name='home'),
    path('alignment/', views.alignment, name='alignment'),
    path('interchanges/', views.interchanges, name='interchanges'),
    path('submitted/', views.submitted, name='submitted'),
    path('results/', views.results, name='results'),
]

handler404 = views.error_404

if settings.DEBUG:
	urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from apis import views

urlpatterns = [
    url(r'^checkboxlist/$', views.GetView.as_view(), name='checkbox-list'),
    url(r'^report/upload', views.FileUploadView.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
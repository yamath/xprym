from django.conf.urls import include, url
from back.views import back_view
from look.views import main, login_view, logout_view, html_view, signup_view

urlpatterns = [
    url(r'^$', main, name='main'),
    url(r'^login$', login_view, name='login_view'),
    url(r'^logout$', logout_view, name='logout_view'),
    url(r'^signup$', signup_view, name='signup_view'),
    url(r'^html/(?P<content>[-0-9A-Za-z]+)$', html_view, name='html_view'),
    url(r'^back/(?P<content>[-0-9A-Za-z]+)$', back_view, name='back_view'),
]

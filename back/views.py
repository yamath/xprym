import time
from back import *
from pony.orm import db_session, commit
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache
from django.shortcuts import redirect, render
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from back import get_free_serial
import logging

def back_view(request, content):
  logger = logging.getLogger(__name__)
  try:
    context = {}
    if content == '':
        return HttpResponse('Void content', content_type="text/plain", status=400)
    elif content == "change_password":
        user = User.objects.get(username=request.user.username)
        new_password = request.POST['new_password']
        user.set_password(new_password)
        user.save()
        return HttpResponse("ok", content_type="text/plain", status=200)
    elif content == 'envelope':
        message = request.POST['message']
        sender = request.POST['sender']
        receiver = request.POST['receiver']
        print('message: {} ({} > {})'.format(message, sender, receiver))
        with db_session:
            Envelope(serial=get_free_serial(), text=message, sender=Profile.get(username=sender), receiver=Profile.get(username=receiver))
    elif content == 'delete':
        print('back/delete POST:', request.POST)
        serial = request.POST['serial']
        with db_session:
            sget(serial).delete()
        return HttpResponse('ok', content_type="text/plain", status=200)
    elif content == 'edit':
        print('back/edit POST:', request.POST)
        serial = request.POST['serial']
        attr = request.POST['attr']
        attr_type = type_dict[attr]
        value = request.POST['value']
        action = request.POST['action']
        with db_session:
            if attr_type == 'float':
                value = float(value)
            elif attr_type == 'json':
                value = eval(value)
            elif attr_type in ['toone', 'tomany']:
                value = sget(value)
            if action in ['edit', 'change']:
                setattr(sget(serial), attr, value)
            elif action == 'add':
                getattr(sget(serial), attr).add(value)
            elif action == 'remove':
                getattr(sget(serial), attr).remove(value)
        return HttpResponse('ok', content_type="text/plain", status=200)
    elif content == 'new':
        print('back/new POST:', request.POST)
        with db_session:
            if request.POST['model']:
                model = eval(request.POST['model'])
                serial = get_free_serial()
                model(serial=serial)
                return HttpResponse(serial, content_type="text/plain", status=200)
            elif request.POST['serial']:
                old_serial = request.POST['serial']
                old_attr = request.POST['attr']
                old_model = sget(old_serial).classtype
                
                new_model = eval(str(type(getattr(sget(old_serial), old_attr))).split('core.')[1].split('Set')[0])
                new_serial = get_free_serial()
                if old_attr == 'questions':
                    new_model(serial=new_serial, node=sget(old_serial), kind='generic')
                else:
                    new_model(serial=new_serial)
                return HttpResponse(new_serial, content_type="text/plain", status=200)
    elif content == 'reledit':
        print('back/reledit POST:', request.POST)
        serial=request.POST['serial']
        attr = request.POST['attr']
        action = request.POST['action']
        value_serial = request.POST['value_serial']
        with db_session:
            if actin == 'add':
                getattr(sget(serial), attr).add(sget(value_serial))
            elif action == 'remove':
                getattr(sget(serial), attr).remove(sget(value_serial))
        return HttpResponse('ok', content_type="text/plain", status=200)
    elif content == 'submit':
        with db_session:
            if request.user.username:
                profile = Profile.get(username=request.user.username)
            else:
                with open("debug_log.txt", "a") as f:
                    f.write("back/views.py submit missing user\n\n")
                return HttpResponse("unauthenticated", content_type="text/plain", status=401)
            question = Question.get(serial=request.POST['serial'])
            answer = request.POST['answer']
            required = request.POST['required']
            print('back/submit', answer, [ option['text'] for option in question.options if option['accepted'] ])
            if answer in [ option['text'] for option in question.options if option['accepted'] ]:
                print('correct answer')
                nm = NodeMean.get(profile=profile, nodemean_node=question.node)
                nm.history = 'A' + nm.history[:3]
                if required=='True':
                    profile.requirements = profile.requirements[1:]
                calculate_profile_mean(profile)
                return HttpResponse('correct', content_type="text/plain", status=200)
            else:
                print('wrong answer')
                nm = NodeMean.get(profile=profile, nodemean_node=question.node)
                nm.history = 'R' + nm.history[:3]
                calculate_profile_mean(profile)
                return HttpResponse('wrong', content_type="text/plain", status=400)
                
    else:
        return None
  except Exception as e:
    logger.error(e)
    with open('debug_log.txt', 'a') as f:
        f.write("back/views.py:\n{}\n\n".format(e))

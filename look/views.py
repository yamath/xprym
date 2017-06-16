from back import *
from pony.orm import db_session
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache
from django.shortcuts import redirect, render
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from random import choice
import pony.orm.core
import django

def main(request):
    if 'message' in dir(request):
        message = request.message
        del request.message
    else:
        message = None
    if request.user.is_authenticated():
        with db_session:
            profile = Profile.get(username=request.user.username)
        return render(request, 'main.html', {'profile':profile, 'message':message})
    else:
        return render(request, 'frontpage.html', {'message':message})


def login_view(request):
    if request.user.is_authenticated():
        return redirect('main')
    if request.method == 'GET':
        return redirect('main')
    elif request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            #request.message = 'Accesso effettuato con successo.'
            return redirect('main')
        else:
            #request.message = 'Accesso non effettuato. Ritenta o contatta il tuo insegnante.'
            return redirect('main')
        
        
def logout_view(request):
    logout(request)
    return redirect('main')


def signup_view(request):
    if request.method == 'POST' and not request.user.is_authenticated():
        username = request.POST['username']
        password = request.POST['password']
        if not authenticate(username=username, password=password):
            try:
                user = User(username=username)
                user.save()
                user.set_password(password)
                user.save()
                with db_session:
                    Profile(username=username, status='a')
                login(request, user)
            except:
                pass
    return redirect('main')
        
@db_session
def html_view(request, content):
    try:
        context = {}
        try:
            context['user'] = request.user
        except:
            context['user'] = None
        if content == '':
            return None
        elif content == 'admin':
            context['models'] = ['Profile', 'Classroom', 'Topic', 'Node', 'Question', 'Envelope', 'NodeMean', 'TopicMean']
            return render(request, 'admin.html', context)
        elif content == 'admin-list':
            model = request.GET['model']
            titles = {
                'Profile': ['username', 'classrooms', 'mean'],
                'Classroom': ['ref'],
                'Topic': ['serial', 'name'],
                'Node': ['serial', 'name'],
                'Question': ['serial', 'text'],
                'Envelope': ['sender', 'receiver'],
                'NodeMean': ['profile', 'nodemean_node', 'value'],
                'TopicMean': ['profile', 'topic', 'value'],
            }
            context['titles'] = titles[model]
            context['models'] = []
            with db_session:
                for item in eval(model).select():
                    model_dict = {}
                    for key, value in item.as_dict().items():
                        if key in context['titles'] and isinstance(value, pony.orm.core.Entity):
                            model_dict[key] = value.info()
                        elif key in context['titles'] and isinstance(value, pony.orm.core.SetInstance):
                            model_dict[key] = [ _item.info() for _item in value ]
                        elif key in context['titles'] and isinstance(value, float):
                            model_dict[key] = "{:.0f}%".format(value*100)
                        else:
                            model_dict[key] = value
                    context['models'].append(model_dict)
            print('html/admin-list', context)
            return render(request, 'admin-list.html', context)
        elif content == 'admin-model':
            serial = request.GET['serial']
            context['serial'] = serial
            context['attrs'] = []
            with db_session:
                context['attrs'] = list(sget(serial).as_dict().keys())           
            return render(request, 'admin-model.html', context)
        elif content == 'admin-edit':
            print('hmtl/admin-edit', request.GET)
            serial = request.GET['serial']
            attr = request.GET['attr']
            action = request.GET['action']
            attr_type = type_dict[attr]
            value = getattr(sget(serial), attr)
            single_line = True
            if attr_type == 'json' or attr_type == 'text':
                single_line = False
            elif attr_type == 'toone':
                value = getattr(sget(serial), attr).serial
            elif attr_type == 'tomany':
                value = ''
            context['serial'] = serial
            context['attr'] = attr
            context['value'] = value
            context['action'] = action
            context['single_line'] = single_line
            return render(request, 'admin-edit.html', context)
        elif content == 'admin-table':
            serial = request.GET['serial']
            attr = request.GET['attr']
            attr_type = type_dict[attr]
            csrf = django.middleware.csrf.get_token(request)
            context['serial'] = serial
            context['attr'] = attr
            context['simple'] = (attr_type in ['string', 'float', 'json', 'text'])
            context['toone'] = (attr_type == 'toone')
            context['tomany'] = (attr_type == 'tomany')
            context['csrf'] = csrf
            context['values'] = []
            if attr_type == 'string' or attr_type == 'text':
                context['values'].append({
                    'info':getattr(sget(serial), attr),
                })
            elif attr_type == 'float':
                context['values'].append({
                    'info': "{:.0f}%".format(getattr(sget(serial), attr)*100),
                })
            elif attr_type == 'json':
                for item in getattr(sget(serial), attr):
                    context['values'].append({
                        'info': str(item),
                    })
            elif attr_type == 'toone':
                context['values'].append({
                    'info':getattr(sget(serial), attr).info(),
                    'serial':getattr(sget(serial), attr).serial,
                })
            elif attr_type == 'tomany':
                for item in getattr(sget(serial), attr):
                    context['values'].append({
                        'info': item.info(),
                        'serial':item.serial,
                    })
            return render(request, 'admin-table.html', context)
        elif content == 'admin-tomany':
            serial = request.GET['serial']
            attr = request.GET['attr']
            values =  [ { 'info':i.info(), 'serial':i.serial } for i in getattr(sget(serial), attr) ]
            context['serial'] = serial
            context['attr'] = attr
            context['values'] = values
            return render(request, 'admin-tomany.html', context)
        elif content == 'admin-value':
            serial = request.GET['serial']
            attr = request.GET['attr']
            instance = sget(serial)
            value = getattr(instance, attr)
            if attr in ['profile', 'sender', 'receiver', 'topic', 'node', 'nodemean_node']:
                value = value.info()
            if attr in ['value', 'mean']:
                value = "{:.0f}%".format(value*100)
            context['serial'] = serial
            context['attr'] = attr
            context['value'] = value
            return render(request, 'admin-value.html', context)
        elif content == 'index':
            profile = Profile.get(username=request.user.username)
            calculate_profile_mean(profile)
            print('index', type(profile.requirements), profile.requirements)
            context['profile'] = {
                'username':profile.username,
                'status':profile.status,
                'firstName':profile.firstName,
                'lastName':profile.lastName,
                'mean':profile.mean or 0,
                'requirements': list(profile.requirements),
                'classrooms': [ c.ref for c in profile.classrooms ],
                'topics': [ {
                    'serial':topic.serial,
                    'name':topic.name,
                    'mean':TopicMean.get(profile=profile, topic=topic).value,
                } for classroom in profile.classrooms for topic in classroom.topics ]}
            return render(request, 'index.html', context)
        elif content == 'login':
            return render(request, 'login.html', context)
        elif content == 'question':
            print(request.GET)
            profile = Profile.get(username=request.user.username)
            if 'topic' in request.GET:
                topic = Topic.get(serial=request.GET['topic'])
                node = sorted(list(topic.nodes), key=lambda node: NodeMean.get(profile=profile, nodemean_node=node).value)[0]
                question = choice( list(node.questions) )
                required = False
            else:
                print(profile.requirements)
                node = Node.get(serial=profile.requirements[0])
                question = choice( list(node.questions) )
                required = True
                topic = None
            context['question'] = {
                'serial': question.serial,
                'name': question.name,
                'notes': question.notes,
                'text': question.text,
                'kind': question.kind,
                'options': list(question.options),
                'node': question.node,
                'required': required,
            }
            if topic:
                context['topic'] = topic.serial
            return render(request, 'question.html', context)
        elif content == 'signup':
            return render(request, 'signup.html', context)
        elif content == 'solution':
            context['correct'] = request.GET['status'] == 'correct'
            question = Question.get(serial=request.GET['serial'])
            context['question'] = question
            context['answer'] = request.GET['answer']
            context['correct_answer'] = [ option['text'] for option in question.options if option['accepted'] ][0]
            return render(request, 'solution.html', context)
        elif content == 'textarea':
            model = eval(request.GET['model'])
            context['model'] = request.GET['model']
            obj = model[request.GET['pk']]
            context['pk'] = request.GET['pk']
            attr = request.GET['attr']
            context['attr'] = request.GET['attr']
            context['string'] = getattr(obj, attr)
            return render(request, 'admin-text.html', context)
        else:
            raise Exception('Unknown command')
    except Exception as e:
        with open("debug_log.txt", "a") as f:
            f.write("html/views.py\n{}\n\n".format(e))
        raise e

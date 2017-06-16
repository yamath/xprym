import back.models as new
import back.oldmodels as old
from pony.orm import *
import back
import time
import os

def derive():
    with db_session:
        profiles = list(old.Profile.select())
    for p in profiles:
        with db_session:
            _p = new.Profile(
                serial=back.get_free_serial(),
                username=p.username,
                status=p.status or 'a',
                firstName=p.firstName,
                lastName=p.lastName,
                mean=p.mean or 0.4,
                requirements=p.requirements or '[]',
            )
        print('new Profile({})'.format(_p.username))
        
    with db_session:
        classrooms = list(old.Classroom.select())
    for c in classrooms:
        with db_session:
            _c = new.Classroom(
                serial=back.get_free_serial(),
                ref=c.ref,
            )
            print('new Classroom({})'.format(_c.ref))
            profiles = old.Classroom.get(ref=c.ref).profiles
            for p in profiles:
                _c.profiles.add(new.Profile.get(username=p.username))
                print('   {} in {}'.format(p.username, c.ref))
                commit()
                
    with db_session:
        for t in old.Topic.select():
            _t = new.Topic(
                serial=back.get_free_serial(),
                name=t.name,
                text=t.text,
                notes=t.notes+t.serial,
            )
            #print('new Topic({})'.format(t.name))
            for c in t.classrooms:
                _t.classrooms.add(new.Classroom.get(ref=c.ref))
                #print('    assigned to {}'.format(c.ref))
    with db_session:
        for n in old.Node.select():
            _n = new.Node(
                serial=back.get_free_serial(),
                name=n.name,
                text=n.text,
                notes=n.notes+n.serial,
            )
            #print('new Node({})'.format(n.name))
            for t in n.topics:
                _n.topics.add(new.Topic.get(notes=t.notes+t.serial))
                #print('    inside', t.name, t.notes+t.serial)
            for a in n.antes:
                _n.antes.add(new.Node.get(notes=a.notes+a.serial))
            for p in n.posts:
                _n.posts.add(new.Node.get(notes=p.notes+p.serial))
    with db_session:
        for q in old.Question.select():
            _q = new.Question(
                serial=back.get_free_serial(),
                name=q.name,
                text=q.text,
                notes=q.notes+q.serial,
                kind=q.kind,
                options=q.options,
                node=new.Node.get(notes=q.node.notes+q.node.serial),
            )
            #print('new Question in', _q.node.serial)
    with db_session:
        for nm in old.NodeMean.select():
            _nm = new.NodeMean(
                serial=back.get_free_serial(),
                profile=new.Profile.get(username=nm.profile.username),
                value=nm.value,
                history=nm.history,
                nodemean_node = new.Node.get(notes=nm.node.notes+nm.node.serial),
            )
    with db_session:
        for tm in old.TopicMean.select():
            _tm = new.TopicMean(
                serial=back.get_free_serial(),
                profile=new.Profile.get(username=tm.profile.username),
                value=tm.value,
                topic = new.Topic.get(notes=tm.topic.notes+tm.topic.serial),
            )

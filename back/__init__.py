from back.models import *
from pony.orm import db_session
from random import choice
import back.legacy


type_dict = {
    'profile':'toone',
    'sender':'toone',
    'receiver':'toone',
    'topic':'toone',
    'node':'toone',
    'nodemean_node':'toone',
    'classrooms':'tomany',
    'sentEnvelopes':'tomany',
    'receivedEnvelopes':'tomany',
    'means':'tomany',
    'profiles':'tomany',
    'topics':'tomany',
    'questions':'tomany',
    'antes':'tomany',
    'posts':'tomany',
    'nodemeans':'tomany',
    'nodes':'tomany',
    'topicmeans':'tomany',
    'serial':'string',
    'username':'string',
    'status':'string',
    'firstName':'string',
    'lastName':'string',
    'ref':'string',
    'kind':'string',
    'history':'string',
    'mean':'float',
    'value':'float',
    'requirements':'json',
    'options':'json',
    'name':'text',
    'text':'text',
    'notes':'text',
}

def calculate_node_mean(profile, node):
    with db_session:
        if isinstance(profile, str):
            profile = Profile[profile]
        if isinstance(node, str):
            node = Node[node]
        mean = NodeMean.get(profile=profile, nodemean_node=node)
        if mean:
            val = lambda c: 10 if c=='A' else 4 if c=='X' else 0
            hval = lambda h: (val(h[3])+2*val(h[2])+3*val(h[1])+4*val(h[0]))/100
            mean.value = hval( mean.history )
        else:
            mean = NodeMean(serial=get_free_serial(), profile=profile, nodemean_node=node, history='XXXX', value=0.4)
    return mean.value
    
    
def calculate_topic_mean(profile, topic):
    with db_session:
        if isinstance(profile, str):
            profile = Profile[profile]
        if isinstance(topic, str):
            topic = Topic[topic]
        mean = TopicMean.get(profile=profile, topic=topic)
        if not mean:
            mean = TopicMean(serial=get_free_serial(), profile=profile, topic=topic, value=0.4)
        nodes = list(mean.topic.nodes)
        for node in nodes:
            calculate_node_mean(profile, node)
        mean.value = sum([ NodeMean.get(profile=profile, nodemean_node=node).value for node in nodes ])/len(nodes)
    return mean.value


def calculate_profile_mean(profile):
    print("profile mean({})".format(profile))
    with db_session:
        if isinstance(profile, str):
            profile = Profile[profile]
        topics = list({ topic for classroom in profile.classrooms for topic in classroom.topics })
        for topic in topics:
            calculate_topic_mean(profile, topic)
        if topics:
            profile.mean = sum([ TopicMean.get(profile=profile, topic=topic).value for topic in topics ])/len(topics)
        else:
            profile.mean = 0
    return profile.mean


def calculate_all_means():
    with db_session:
        profiles = Profile.select()
        for profile in profiles:
            calculate_profile_mean(profile)

def require_all_profiles():
    with open('require_log.txt', 'w') as f:
        f.write('New requirements\n'+'='*80+'\n')
    with db_session:
        for profile in Profile.select():
            require_profile(profile)

def require_profile(profile):
    with open('require_log.txt', 'a') as f:
        f.write('requirements for {}\n'.format(profile))
    with db_session:
        if profile.requirements is None:
            profile.requirements = []
        quantity = 10 - int(9.99*profile.mean)
        with open('require_log.txt', 'a') as f:
            f.write('previous requirements: {}\n'.format(profile.requirements))
            f.write('mean {} -> quantity {} \n'.format(profile.mean, quantity))
        def get_value(profile, node):
            nm = NodeMean.get(profile=profile, nodemean_node=node)
            if nm:
                return nm.value
            else:
                return 0.4
        node_serials = sorted({ node.serial for classroom in profile.classrooms for topic in classroom.topics for node in topic.nodes },
                              key=lambda node: get_value(profile=profile, node=node))[:quantity]
        with open('require_log.txt', 'a') as f:
            f.write('node serials ' + str(node_serials) + '\n')
        assert( isinstance(profile.requirements, list) )
        profile.requirements = profile.requirements + node_serials
        with open('require_log.txt', 'a') as f:
            f.write('later requirements: {}\n'.format(profile.requirements))
        leftovers = max(0, len(profile.requirements)-10)
        if leftovers > 0:
            profile.requirements = profile.requirements[leftovers:]
            forget_profile(leftovers, profile)

def forget_profile(n, profile):
    def get_value(profile, node):
            nm = NodeMean.get(profile=profile, nodemean_node=node)
            if nm:
                return nm.value
            else:
                return 0.4
    with db_session:
        for i in range(n):
            forget_profile_node(profile,
                                sorted({ node for classroom in profile.classrooms for topic in classroom.topics for node in topic.nodes },
                                       key=lambda node: get_value(profile=profile, node=node))[-1])
    calculate_profile_mean(profile)
    print('forgot', n, profile)

def forget_profile_node(profile, node):
    with db_session:
        nm = NodeMean.get(profile=profile, nodemean_node=node)
        if nm:
            nm.history = 'X' + nm.history[:3]
        else:
            pass
    calculate_node_mean(profile, node)

    
def get_free_serial():
    def encode(n):
        ab = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        d = { i:ab[i] for i in range(len(ab)) }
        q, r = n // len(ab), n % len(ab)
        s = (encode(q) if q > 0 else '') + d[r]
        return s
    def decode(s):
        ab = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        d = { ab[i]:i for i in range(len(ab)) }
        if len(s)==1:
            return d[s[0]]
        else:
            return len(ab)*decode(s[:-1]) + d[s[-1]]
    with db_session:
        if len(Datarow.select())>0:
            return encode(decode(Datarow.select().order_by(desc(Datarow.serial)).first().serial)+1)
        else:
            return '0'

def sget(ref):
    if isinstance(ref, str):
        with db_session:
            try:
                return Datarow[ref.lstrip('0')]
            except:
                return Datarow['{:0>10}'.format(ref.lstrip('0'))]
    elif isinstance(ref, (Datarow, Profile, Classroom, Mean, Content, Envelope, TopicMean, Node, Question, NodeMean, Topic)):
        return ref

#legacy.derive()
        
    

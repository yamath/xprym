from pony.orm import *


db = Database()


class Datarow(db.Entity):
    serial = PrimaryKey(str, 10)
    
    def as_dict(self):
        return { attr:getattr(self, attr) for attr in ['serial'] }


class Profile(Datarow):
    username = Required(str, 40)
    status = Required(str, 10, default='a')
    firstName = Optional(unicode, 160)
    lastName = Optional(unicode, 160)
    mean = Required(float, default=0.4)
    requirements = Required(Json, default="[]")
    classrooms = Set('Classroom')
    sentEnvelopes = Set('Envelope', reverse='sender')
    receivedEnvelopes = Set('Envelope', reverse='receiver')
    means = Set('Mean')
    
    def as_dict(self):
        return { attr:getattr(self, attr) for attr in ['serial', 'username', 'status', 'firstName', 'lastName', 'mean', 'requirements', 'classrooms', 'sentEnvelopes', 'receivedEnvelopes', 'means'] }
    
    def info(self):
        return "{} ({:.0f}%)".format(self.username, self.mean*100)


class Classroom(Datarow):
    ref = Required(unicode, 40, default='*')
    profiles = Set(Profile)
    topics = Set('Topic')
    
    def as_dict(self):
        return { attr:getattr(self, attr) for attr in ['serial', 'ref', 'profiles', 'topics'] }
    
    def info(self):
        return self.ref


class Mean(Datarow):
    value = Required(float, default="0.4")
    profile = Required(Profile)
    
    def as_dict(self):
        return { attr:getattr(self, attr) for attr in ['serial', 'value', 'profile'] }


class Content(Datarow):
    name = Optional(str, 160)
    text = Optional(LongUnicode)
    notes = Optional(LongUnicode)
    
    def as_dict(self):
        return { attr:getattr(self, attr) for attr in ['serial', 'name', 'text', 'notes'] }


class Envelope(Content):
    sender = Required(Profile, reverse='sentEnvelopes')
    receiver = Required(Profile, reverse='receivedEnvelopes')
    
    def as_dict(self):
        d = Content.as_dict(self)
        d.update({ attr:getattr(self, attr) for attr in ['sender', 'receiver'] })
        return d
    
    def info(self):
        return "{} > {}".format(self.sender.username, self.receiver.username)


class TopicMean(Mean):
    topic = Required('Topic')
    
    def as_dict(self):
        d = Mean.as_dict(self)
        d.update({ attr:getattr(self, attr) for attr in ['topic'] })
        return d
    
    def info(self):
        return "{}|{}:{:.0f}%".format(self.profile.username, self.topic.name, self.value*100)


class Node(Content):
    questions = Set('Question')
    topics = Set('Topic')
    antes = Set('Node', reverse='posts')
    posts = Set('Node', reverse='antes')
    nodemeans = Set('NodeMean', reverse='nodemean_node')
    
    def as_dict(self):
        d = Content.as_dict(self)
        d.update({ attr:getattr(self, attr) for attr in ['questions', 'topics', 'antes', 'posts', 'nodemeans'] })
        return d
    
    def info(self):
        return "({}) {}".format(self.serial, self.name)


class Question(Content):
    kind = Required(str, 10)
    options = Required(Json, default="[]")
    node = Required(Node)
    
    def as_dict(self):
        d = Content.as_dict(self)
        d.update({ attr:getattr(self, attr) for attr in ['kind', 'options', 'node'] })
        return d
    
    def info(self):
        return "({}) {}".format(self.serial, self.text)


class NodeMean(Mean):
    nodemean_node = Required(Node)
    history = Required(str, 4, default="XXXX")
    
    def as_dict(self):
        d = Mean.as_dict(self)
        d.update({ attr:getattr(self, attr) for attr in ['nodemean_node', 'history'] })
        return d
    
    def info(self):
        return "{}|{}:{:.0f}%".format(self.profile.username, self.nodemean_node.name, self.value*100)


class Topic(Content):
    nodes = Set(Node)
    classrooms = Set(Classroom)
    topicmeans = Set(TopicMean)
    
    def as_dict(self):
        d = Content.as_dict(self)
        d.update({ attr:getattr(self, attr) for attr in ['nodes', 'classrooms', 'topicmeans'] })
        return d
    
    def info(self):
        return "({}) {}".format(self.serial, self.name)


db.bind("sqlite", "backdb.sqlite", create_db=True)
db.generate_mapping(create_tables=True)

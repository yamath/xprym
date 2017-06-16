from pony.orm import *


db = Database()


class Profile(db.Entity):
    username = PrimaryKey(str, 16)
    status = Required(str, 10)
    firstName = Optional(unicode, 160)
    lastName = Optional(unicode, 160)
    mean = Optional(float)
    requirements = Optional(Json)
    classrooms = Set('Classroom')
    topicmeans = Set('TopicMean')
    nodemeans = Set('NodeMean')
    sentEnvelopes = Set('Envelope', reverse='sender')
    receivedEnvelopes = Set('Envelope', reverse='receiver')


class Classroom(db.Entity):
    ref = PrimaryKey(unicode, 40)
    profiles = Set(Profile)
    topics = Set('Topic')


class Content(db.Entity):
    serial = PrimaryKey(str, 8)
    name = Optional(unicode, 160)
    notes = Optional(LongUnicode)
    text = Optional(LongUnicode)


class Topic(Content):
    nodes = Set('Node')
    classrooms = Set(Classroom)
    topicmeans = Set('TopicMean')


class Node(Content):
    bloom = Optional(str, 10)
    mobile = Optional(bool)
    questions = Set('Question')
    topics = Set(Topic)
    antes = Set('Node', reverse='posts')
    posts = Set('Node', reverse='antes')
    nodemeans = Set('NodeMean')


class Question(Content):
    kind = Optional(str, 10)
    options = Optional(Json)
    node = Optional(Node)


class TopicMean(db.Entity):
    profile = Required(Profile)
    topic = Required(Topic)
    value = Required(float)
    PrimaryKey(profile, topic)


class NodeMean(db.Entity):
    profile = Required(Profile)
    node = Required(Node)
    history = Required(str, 4)
    value = Required(float)
    PrimaryKey(profile, node)


class Envelope(Content):
    sender = Required(Profile, reverse='sentEnvelopes')
    receiver = Required(Profile, reverse='receivedEnvelopes')


db.bind("sqlite", "olddb.sqlite", create_db=True)
db.generate_mapping(create_tables=True)
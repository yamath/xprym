from pony.orm import *


db = Database()


class Datum(db.Entity):
    serial = PrimaryKey(int, auto=True)


class Content(Datum):
    name = Optional(unicode)
    text = Optional(LongUnicode)
    note = Optional(LongUnicode)
    means = Set('Mean')


class Topic(Content):
    classrooms = Set('Classroom')
    nodes = Set('Node')


class Node(Content):
    topics = Set(Topic)
    questions = Set('Question')


class Question(Content):
    kind = Required(str, default='open')
    node = Required(Node, cascade_delete=True)
    options = Set('Option')
    students = Set('Student')


class Option(Datum):
    answer = Required(unicode)
    accepted = Required(bool)
    question = Required(Question)


class Profile(Datum):
    username = Required(str)
    sents = Set('Envelope', reverse='sender')
    receiveds = Set('Envelope', reverse='receiver')


class Student(Profile):
    mean = Required(float, default="0.4")
    means = Set('Mean')
    classroom = Required('Classroom')
    questions = Set(Question)


class Teacher(Profile):
    classrooms = Set('Classroom')


class Classroom(Datum):
    ref = Optional(str)
    topics = Set(Topic)
    students = Set(Student)
    teachers = Set(Teacher)


class Mean(Datum):
    value = Required(float, default="0.4")
    history = Optional(str, default='XXXX')
    content = Required(Content)
    student = Required(Student)


class Envelope(Content):
    sender = Required(Profile, reverse='sents')
    receiver = Required(Profile, reverse='receiveds')


db.bind("sqlite", "database.sqlite", create_db=True)
db.generate_mapping(create_tables=True)

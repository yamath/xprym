from pyparsing import *
from back import *

sep = Suppress(Keyword('::='))
question = Suppress(Keyword('Question'))
rest = Word(printables + ' èéòàùì')

expr = OneOrMore((question + sep + rest).setParseAction( lambda d: eval(d[0]) ))

f = open('questions.txt', 'r')
s = f.read()


with db_session:
    try:
        Node['5FJ'].delete()
        commit()
    except:
        pass
    commit()
    node = Node(serial = '5FJ', name="Equazioni risolubili con la sostituzione")
    node.topics.add(sget('5F9'))
    for kind, text, pre_options in expr.parseString(s):
        Question(serial=get_free_serial(), kind=kind, text=text, options=[ {'text':key, 'accepted':value} for key, value in pre_options.items() ], node=node)

f.close()

__pragma__ ('alias', 'S', '$')

def sendMessage():
    message = prompt("Scrivi qui il messaggio:", "Nessun messaggio")
    print("ricevuto", message)
    csrftoken = S("[name=csrfmiddlewaretoken]").val()
    sender = S("[name=envelope_username]").val()
    receiver = 'admin'
    data = {
        'message':message,
        'sender':sender,
        'receiver': receiver,
    }
    S.ajax({
        'method': 'POST',
        'headers': {
            'X_CSRF_TOKEN':csrftoken,
            'X-CSRFToken':csrftoken,
        },
        'data': data,
        'url': 'back/envelope',
        'complete': lambda d: alert("Messaggio inviato"),
    })


def clean(*args):
    for id in args:
        S("#{}".format(id)).empty()

        
def hide(*args):
    for id in args:
        S("#{}".format(id)).css('visibility', 'hidden')


def collapse_table(id):
    if S("#{} tbody tr:first-child".format(id)).css('visibility') == 'hidden':
        S("#{} tbody tr:first-child".format(id)).css('visibility', 'visible')
        S("#{} tbody tr:not(:first-child)".format(id)).show()
    else:
        S("#{} tbody tr:first-child".format(id)).css('visibility', 'hidden')
        S("#{} tbody tr:not(:first-child)".format(id)).hide()

    
def load(id, query):
    print('load', id, query)
    hide(id)
    S.ajax({
        'method': 'GET',
        'url': query,
        'success': lambda d: S("#{}".format(id)).html(d),
        'error': lambda t, e: S("#{}".format(id)).html(e),
        'complete': lambda d: typeset_and_show(id),})
    if id in ['board', 'admin_board']:
        window.scrollTo(0, 0)

def edit(data={}):
    print('active.edit' + str(data))
    if 'value' not in data:
        data['value'] = S("[name={}]".format(data['attr'])).val()
    if 'csrf' in data:
        csrftoken = data['csrf']
    else:
        csrftoken = S("[name=csrfmiddlewaretoken]").val()
    S.ajax({
        'method': 'POST',
        'headers': {
            'X_CSRF_TOKEN':csrftoken,
            'X-CSRFToken':csrftoken,
        },
        'data': data,
        'url': 'back/edit',
        'complete': lambda d: load(data['attr'], 'html/admin-table?serial={}&attr={}'.format(data['serial'], data['attr'])),
    })
    return False


def new_model(serial=None, attr=None, model=None, csrf=None):
    print(serial, attr, model, csrf)
    data = {}
    data['serial'] = serial
    data['attr'] = attr
    data['model'] = model
    S.ajax({
        'method': 'POST',
        'headers': {
            'X_CSRF_TOKEN':csrf,
            'X-CSRFToken':csrf,
        },
        'data': data,
        'url': 'back/new',
        'success': lambda d: load('admin_board', 'html/admin-model?serial={}'.format(d)),
    })
    
    
def show(*args):
    for id in args:
        S("#{}".format(id)).show()
        S("#{}".format(id)).css('visibility', 'visible')
        
        
def submit():
    def wrong_answer(d, e):
        if d['status']=='401':
            load('board', "html/login")
        else:
            load('board', 'html/solution?status=wrong&serial={}&answer={}'.format(data['serial'], data['answer']))
    hide('board')
    kind = S("[name=kind]").val()
    csrftoken = S("[name=csrfmiddlewaretoken]").val();
    if kind=='bool':
        answer = S("input:checked").val()
    elif kind=='multi':
        answer = S("input:checked").val()
    elif kind=='open':
        answer = S("#textInput").val()
    else:
        answer = 'done'
    required = S("[name=required]").val()
    data = {
        'serial': S("h1 small").html(),
        'answer': answer,
        'required': required,
    }
    S.ajax({
        'method': 'POST',
        'headers': {
            'X_CSRF_TOKEN':csrftoken,
            'X-CSRFToken':csrftoken,},
        'data': data,
        'url': 'back/submit',
        'success': lambda d: load('board', 'html/solution?status=correct&serial={}&answer={}'.format(data['serial'], data['answer'])),
        'error': wrong_answer,
    })
    return False


def common_truth(s):
    if s.lower() in ['true', 'vero']:
        return 'true'
    elif s.lower() in ['false', 'falso']:
        return 'false'
    else:
        raise ValueError("{} is not bool".format(s))


def typeset_and_show(id):
    MathJax.Hub.Queue(['Typeset', MathJax.Hub])
    show(id)

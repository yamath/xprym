from django import template

register = template.Library()

@register.filter
def dictitem(d, k):
    return d[k]

@register.filter
def percent(x):
    return "{:.0f}%".format(x*100)

@register.filter
def isBool(q):
    try:
        return q.kind == 'b' or q.kind == 'bool'
    except:
        try:
            return q['kind'] == 'b' or q['kind'] == 'bool'
        except:
            return False

@register.filter
def isMulti(q):
    try:
        return q.kind == 'm' or q.kind == 'multi'
    except:
        try:
            return q['kind'] == 'm' or q['kind'] == 'multi'
        except:
            return False

@register.filter
def isOpen(q):
    try:
        return q.kind == 'o' or q.kind == 'open'
    except:
        try:
            return q['kind'] == 'o' or q['kind'] == 'open'
        except:
            return False

import back
import data

link = {}

with db_session:
    for node in back.Node.select():
        _node = data.Node(name=node.name, text=node.text, note=node.notes)
        link[node.serial] = _node.serial

print(link)
    

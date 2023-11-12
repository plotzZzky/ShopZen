

def serialize_cart_item(cart_item):
    item_model = cart_item.item
    item_id = cart_item.id
    name = item_model.name
    market = item_model.market
    amount = cart_item.amount
    return {'id': item_id, 'name': name, 'market': market, 'amount': amount}


def serialize_pantry_item(pantry_item):
    item_model = pantry_item.item
    item_id = pantry_item.id
    name = item_model.name
    market = item_model.market
    validate = item_model.validate
    date = pantry_item.date
    return {'id': item_id, 'name': name, 'market': market, 'validate': validate, 'date': date}


def serialize_item_model(item):
    item_id = item.id
    name = item.name
    market = item.market
    return {'id': item_id, 'name': name, 'market': market}

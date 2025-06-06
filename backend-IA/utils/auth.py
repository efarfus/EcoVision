SECRET_KEY = 'Ufsd897¨%$7s9d8fSDFs76d5sf*&¨%@'

def check_api_key(req):
    return req.headers.get('x-api-key') == SECRET_KEY

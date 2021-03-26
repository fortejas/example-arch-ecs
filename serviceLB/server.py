import os
from flask import (
    Flask,
    jsonify,
    request
)

VERSION = '0.0.1'
SERVICE_NAME = os.environ.get('SERVICE_NAME', 'default')
SECRET_VAR = os.environ.get('SECRET_VAR', 'not-specified')
APP_ROOT = os.environ.get('APP_ROOT', '/')


APP = Flask(__name__)

@APP.route(f'{APP_ROOT}')
def home():
    return jsonify(**{
        'service_name': SERVICE_NAME,
        'version': VERSION,
        'config': {
            'SECRET_VAR': SECRET_VAR
        },
        'headers': {k:v for k, v in request.headers}
    })


@APP.route(f'/healthz')
def health():
    return jsonify(**{'status': 'healthy'})


if __name__ == "__main__":
    APP.run(host='0.0.0.0', port=3000)

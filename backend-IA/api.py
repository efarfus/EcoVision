import os
from flask import Flask
from routes.predict import predict_bp
from routes.health import health_bp

def create_app():
    app = Flask(__name__)
    
    app.register_blueprint(predict_bp)
    app.register_blueprint(health_bp)
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port)

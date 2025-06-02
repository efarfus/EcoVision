from .predict import predict_bp
from .health import health_bp

def register_blueprints(app):
    app.register_blueprint(predict_bp)
    app.register_blueprint(health_bp)

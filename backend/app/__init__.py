from flask import Flask
from flask_cors import CORS
from .config.config import Config
from .routes import register_routes
from .models import init_db

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS
    CORS(app)
    
    # Initialize database
    init_db(app)
    
    # Register all routes
    register_routes(app)
    
    return app 
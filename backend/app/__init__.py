from flask import Flask
from flask_cors import CORS
from .config.config import Config
from .routes import register_routes
from .models import init_db
from .extensions import init_extensions

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS with more specific configuration
    CORS(app, 
         resources={r"/api/*": {"origins": "*"}},
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    
    # Initialize database
    init_db(app)
    
    # Initialize extensions and config variables
    init_extensions(app)
    
    # Register all routes
    register_routes(app)
    
    return app 
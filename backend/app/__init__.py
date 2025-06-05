from flask import Flask
from flask_cors import CORS
from .config.config import Config, config
from .routes import register_routes
from .models import init_db
from .extensions import init_extensions

def create_app(config_class=Config):
    app = Flask(__name__)
    
    # 直接设置数据库配置
    app.config['SQLALCHEMY_DATABASE_URI'] = config.database.uri
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = config.database.track_modifications
    app.config['SQLALCHEMY_ECHO'] = config.database.echo
    
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
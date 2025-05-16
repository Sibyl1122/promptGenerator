from flask import Blueprint

# Blueprint for API routes
api_bp = Blueprint('api', __name__, url_prefix='/api')

# Import routes
from .prompt_routes import *
from .template_routes import *
from .execution_routes import *
from .prompt_generation_routes import *
from .model_routes import *

def register_routes(app):
    # Register API blueprint
    app.register_blueprint(api_bp) 
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
        
        # Import models to ensure they're registered with SQLAlchemy
        from .prompt_template import PromptTemplate
        from .prompt import Prompt
        from .prompt_version import PromptVersion
        from .prompt_shots import PromptShots 
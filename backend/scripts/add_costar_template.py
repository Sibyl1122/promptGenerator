#!/usr/bin/env python
import os
import sys
import json
from datetime import datetime

# Add the parent directory to path so we can import the app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.models.prompt_template import PromptTemplate

def add_costar_template():
    """Add the CO-STAR framework template to the database."""
    app = create_app()
    
    with app.app_context():
        # Check if template already exists
        existing_template = PromptTemplate.query.filter_by(name="CO-STAR Framework Template").first()
        if existing_template:
            print("CO-STAR template already exists in the database.")
            return
        
        # Load template from file
        template_path = os.path.join(app.root_path, 'templates', 'costar_prompt_template.json')
        try:
            with open(template_path, 'r') as file:
                template_data = json.load(file)
        except FileNotFoundError:
            print(f"Template file not found: {template_path}")
            return
        except json.JSONDecodeError:
            print(f"Invalid JSON in template file: {template_path}")
            return
        
        # Create new template
        new_template = PromptTemplate(
            name=template_data['name'],
            content=template_data['content'],
            status=template_data['status']
        )
        
        # Add to database
        db.session.add(new_template)
        db.session.commit()
        
        print(f"Successfully added CO-STAR template with ID: {new_template.id}")

if __name__ == "__main__":
    add_costar_template() 
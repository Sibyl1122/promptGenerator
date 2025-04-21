#!/usr/bin/env python
import os
import sys
import json
from datetime import datetime

# Add the parent directory to path so we can import the app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.models import db
from app.models.prompt_template import PromptTemplate

TEMPLATE_FILES = [
    'costar_prompt_template.json',
    'role_prompt_template.json',
    'step_by_step_template.json'
]

def add_templates():
    """Add the predefined templates to the database."""
    app = create_app()
    
    with app.app_context():
        templates_dir = os.path.join(app.root_path, 'templates')
        
        # Ensure templates directory exists
        if not os.path.exists(templates_dir):
            os.makedirs(templates_dir)
        
        for template_file in TEMPLATE_FILES:
            template_path = os.path.join(templates_dir, template_file)
            
            try:
                with open(template_path, 'r') as file:
                    template_data = json.load(file)
            except FileNotFoundError:
                print(f"Template file not found: {template_path}")
                continue
            except json.JSONDecodeError:
                print(f"Invalid JSON in template file: {template_path}")
                continue
            
            # Check if template already exists
            existing_template = PromptTemplate.query.filter_by(name=template_data['name']).first()
            if existing_template:
                print(f"Template '{template_data['name']}' already exists in the database.")
                continue
            
            # Create new template
            new_template = PromptTemplate(
                name=template_data['name'],
                content=template_data['content'],
                status=template_data['status']
            )
            
            # Add to database
            db.session.add(new_template)
            db.session.commit()
            
            print(f"Successfully added template '{template_data['name']}' with ID: {new_template.id}")

if __name__ == "__main__":
    add_templates() 
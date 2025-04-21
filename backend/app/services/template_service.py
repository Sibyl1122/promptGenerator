from jinja2 import Template, Environment, meta
from ..models.prompt_template import PromptTemplate
from ..models import db

def render_template(template_content, variables):
    """Render a template with the provided variables"""
    template = Template(template_content)
    return template.render(**variables)

def get_template_variables(template_content):
    """Extract variables from a template"""
    env = Environment()
    ast = env.parse(template_content)
    return meta.find_undeclared_variables(ast)

def get_default_templates():
    """Get the list of default templates for prompt generation"""
    default_templates = [
        {
            "name": "Simple Instruction",
            "content": """{{ instruction }}"""
        },
        {
            "name": "Task with Context",
            "content": """Context: {{ context }}

Task: {{ task }}

Output:"""
        },
        {
            "name": "Role-Based",
            "content": """You are a {{ role }}. Your task is to {{ task }}.

{% if context %}
Context:
{{ context }}
{% endif %}

Instructions:
{{ instructions }}"""
        }
    ]
    
    return default_templates

def initialize_default_templates():
    """Initialize the database with default templates if they don't exist"""
    defaults = get_default_templates()
    
    for template_data in defaults:
        # Check if template with this name already exists
        existing = PromptTemplate.query.filter_by(name=template_data['name']).first()
        
        if not existing:
            template = PromptTemplate(
                name=template_data['name'],
                content=template_data['content']
            )
            db.session.add(template)
    
    db.session.commit() 
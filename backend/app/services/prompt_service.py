from ..models import db
from ..models.prompt import Prompt
from ..models.prompt_version import PromptVersion

def create_prompt(name, content, source='user'):
    """Create a new prompt with an initial version"""
    # Create the prompt
    prompt = Prompt(
        name=name,
        source=source
    )
    
    db.session.add(prompt)
    db.session.flush()  # Generate ID for prompt before creating version
    
    # Create the first version
    version = PromptVersion(
        prompt_id=prompt.id,
        version=1,
        content=content
    )
    
    db.session.add(version)
    db.session.commit()
    
    return prompt

def update_prompt(prompt_id, content, name=None):
    """Update a prompt by creating a new version"""
    prompt = Prompt.query.get(prompt_id)
    
    if not prompt:
        return None
    
    # Update the name if provided
    if name:
        prompt.name = name
    
    # Create a new version
    new_version = prompt.latest_version + 1
    
    version = PromptVersion(
        prompt_id=prompt.id,
        version=new_version,
        content=content
    )
    
    # Update the latest version in the prompt
    prompt.latest_version = new_version
    
    db.session.add(version)
    db.session.commit()
    
    return prompt

def get_prompt(prompt_id):
    """Get a prompt by ID"""
    return Prompt.query.filter_by(id=prompt_id, status='active').first()

def get_prompt_version(prompt_id, version=None):
    """Get a specific version of a prompt"""
    if version:
        return PromptVersion.query.filter_by(prompt_id=prompt_id, version=version).first()
    else:
        prompt = Prompt.query.get(prompt_id)
        if not prompt:
            return None
        
        return PromptVersion.query.filter_by(prompt_id=prompt_id, version=prompt.latest_version).first() 
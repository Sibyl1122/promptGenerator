from flask import request, jsonify
from ..models import db
from ..models.prompt import Prompt
from ..models.prompt_version import PromptVersion
from . import api_bp
from ..services.prompt_service import create_prompt, update_prompt, get_prompt

@api_bp.route('/prompts', methods=['GET'])
def get_prompts():
    """Get all prompts"""
    prompts = Prompt.query.filter_by(status='active').all()
    return jsonify([prompt.to_dict() for prompt in prompts])

@api_bp.route('/prompts/<int:prompt_id>', methods=['GET'])
def get_prompt_by_id(prompt_id):
    """Get a prompt by ID"""
    prompt = get_prompt(prompt_id)
    if not prompt:
        return jsonify({'error': 'Prompt not found'}), 404
    
    result = prompt.to_dict()
    
    # Get the latest version
    latest_version = PromptVersion.query.filter_by(
        prompt_id=prompt_id, 
        version=prompt.latest_version
    ).first()
    
    if latest_version:
        result['content'] = latest_version.content
    
    return jsonify(result)

@api_bp.route('/prompts', methods=['POST'])
def create_prompt_route():
    """Create a new prompt"""
    data = request.json
    
    if not data or not data.get('name') or not data.get('content'):
        return jsonify({'error': 'Name and content are required'}), 400
    
    prompt = create_prompt(data.get('name'), data.get('content'), data.get('source', 'user'))
    
    return jsonify(prompt.to_dict()), 201

@api_bp.route('/prompts/<int:prompt_id>', methods=['PUT'])
def update_prompt_route(prompt_id):
    """Update a prompt"""
    data = request.json
    
    if not data or not data.get('content'):
        return jsonify({'error': 'Content is required'}), 400
    
    prompt = update_prompt(prompt_id, data.get('content'), data.get('name'))
    
    if not prompt:
        return jsonify({'error': 'Prompt not found'}), 404
    
    return jsonify(prompt.to_dict())

@api_bp.route('/prompts/<int:prompt_id>', methods=['DELETE'])
def delete_prompt(prompt_id):
    """Delete a prompt (soft delete)"""
    prompt = Prompt.query.get(prompt_id)
    
    if not prompt:
        return jsonify({'error': 'Prompt not found'}), 404
    
    prompt.status = 'deleted'
    db.session.commit()
    
    return jsonify({'message': 'Prompt deleted successfully'})

@api_bp.route('/prompts/<int:prompt_id>/versions', methods=['GET'])
def get_prompt_versions(prompt_id):
    """Get all versions of a prompt"""
    versions = PromptVersion.query.filter_by(prompt_id=prompt_id).order_by(PromptVersion.version.desc()).all()
    
    return jsonify([version.to_dict() for version in versions]) 
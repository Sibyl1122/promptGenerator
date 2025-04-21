from flask import request, jsonify
from ..models import db
from ..models.prompt_template import PromptTemplate
from . import api_bp

@api_bp.route('/templates', methods=['GET'])
def get_templates():
    """Get all templates"""
    templates = PromptTemplate.query.filter_by(status='active').all()
    return jsonify([template.to_dict() for template in templates])

@api_bp.route('/templates/<int:template_id>', methods=['GET'])
def get_template(template_id):
    """Get a template by ID"""
    template = PromptTemplate.query.get(template_id)
    
    if not template:
        return jsonify({'error': 'Template not found'}), 404
    
    return jsonify(template.to_dict())

@api_bp.route('/templates', methods=['POST'])
def create_template():
    """Create a new template"""
    data = request.json
    
    if not data or not data.get('name') or not data.get('content'):
        return jsonify({'error': 'Name and content are required'}), 400
    
    template = PromptTemplate(
        name=data.get('name'),
        content=data.get('content')
    )
    
    db.session.add(template)
    db.session.commit()
    
    return jsonify(template.to_dict()), 201

@api_bp.route('/templates/<int:template_id>', methods=['PUT'])
def update_template(template_id):
    """Update a template"""
    template = PromptTemplate.query.get(template_id)
    
    if not template:
        return jsonify({'error': 'Template not found'}), 404
    
    data = request.json
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    if 'name' in data:
        template.name = data['name']
    
    if 'content' in data:
        template.content = data['content']
    
    db.session.commit()
    
    return jsonify(template.to_dict())

@api_bp.route('/templates/<int:template_id>', methods=['DELETE'])
def delete_template(template_id):
    """Delete a template (soft delete)"""
    template = PromptTemplate.query.get(template_id)
    
    if not template:
        return jsonify({'error': 'Template not found'}), 404
    
    template.status = 'deleted'
    db.session.commit()
    
    return jsonify({'message': 'Template deleted successfully'}) 
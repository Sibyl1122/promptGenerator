from flask import request, jsonify
from . import api_bp
from ..models import db
from ..models.model_config import ModelConfig
from ..services.model_service import (
    get_models, get_model, get_default_model, 
    create_model, update_model, delete_model, set_default_model
)

@api_bp.route('/models', methods=['GET'])
def get_models_route():
    """Get all models"""
    models = get_models()
    return jsonify([model.to_dict() for model in models])

@api_bp.route('/models/<int:model_id>', methods=['GET'])
def get_model_route(model_id):
    """Get a model by ID"""
    model = get_model(model_id)
    
    if not model:
        return jsonify({'error': 'Model not found'}), 404
    
    return jsonify(model.to_dict())

@api_bp.route('/models/default', methods=['GET'])
def get_default_model_route():
    """Get the default model"""
    model = get_default_model()
    
    if not model:
        return jsonify({'error': 'No default model found'}), 404
    
    return jsonify(model.to_dict())

@api_bp.route('/models', methods=['POST'])
def create_model_route():
    """Create a new model"""
    data = request.json
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    required_fields = ['name', 'model_id', 'base_url']
    missing_fields = [field for field in required_fields if field not in data]
    
    if missing_fields:
        return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400
    
    model = create_model(
        name=data.get('name'),
        model_id=data.get('model_id'),
        base_url=data.get('base_url'),
        api_key=data.get('api_key', ''),
        api_type=data.get('api_type', 'openai'),
        api_version=data.get('api_version', ''),
        is_default=data.get('is_default', False)
    )
    
    return jsonify(model.to_dict()), 201

@api_bp.route('/models/<int:model_id>', methods=['PUT'])
def update_model_route(model_id):
    """Update a model"""
    data = request.json
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    model = update_model(
        model_id=model_id,
        name=data.get('name'),
        model_id_new=data.get('model_id'),
        base_url=data.get('base_url'),
        api_key=data.get('api_key'),
        api_type=data.get('api_type'),
        api_version=data.get('api_version'),
        is_default=data.get('is_default')
    )
    
    if not model:
        return jsonify({'error': 'Model not found'}), 404
    
    return jsonify(model.to_dict())

@api_bp.route('/models/<int:model_id>', methods=['DELETE'])
def delete_model_route(model_id):
    """Delete a model"""
    result = delete_model(model_id)
    
    if not result:
        return jsonify({'error': 'Model not found or is the default model (cannot delete)'}), 404
    
    return jsonify({'message': 'Model deleted successfully'})

@api_bp.route('/models/<int:model_id>/default', methods=['POST'])
def set_default_model_route(model_id):
    """Set a model as the default"""
    result = set_default_model(model_id)
    
    if not result:
        return jsonify({'error': 'Model not found'}), 404
    
    return jsonify({'message': 'Default model set successfully'}) 
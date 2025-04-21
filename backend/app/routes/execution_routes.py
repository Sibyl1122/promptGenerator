from flask import request, jsonify
from . import api_bp
from ..services.llm_service import execute_prompt
from ..models.prompt_shots import PromptShots
from ..models import db

@api_bp.route('/execute', methods=['POST'])
def execute():
    """Execute a prompt with a LLM"""
    data = request.json
    
    if not data or not data.get('prompt'):
        return jsonify({'error': 'Prompt is required'}), 400
    
    # Extract parameters
    prompt = data.get('prompt')
    model = data.get('model')
    temperature = data.get('temperature')
    max_tokens = data.get('max_tokens')
    
    # Execute the prompt
    try:
        result = execute_prompt(prompt, model, temperature, max_tokens)
        
        # If prompt_id is provided, save this execution as a shot
        prompt_id = data.get('prompt_id')
        if prompt_id:
            shot = PromptShots(
                prompt_id=prompt_id,
                content=f"Input:\n{prompt}\n\nOutput:\n{result}"
            )
            db.session.add(shot)
            db.session.commit()
        
        return jsonify({
            'result': result,
            'model': model,
            'temperature': temperature,
            'max_tokens': max_tokens
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/prompts/<int:prompt_id>/shots', methods=['GET'])
def get_prompt_shots(prompt_id):
    """Get execution history (shots) for a prompt"""
    shots = PromptShots.query.filter_by(prompt_id=prompt_id).order_by(PromptShots.created_time.desc()).all()
    
    return jsonify([shot.to_dict() for shot in shots]) 
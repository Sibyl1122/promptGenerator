"""
Prompt Generation Routes Module

This module defines API routes for generating prompts using the LLM service.
It allows users to provide a description and optionally specify a template to
format the prompt. The generated prompts can also be saved to the database.
"""

from flask import request, jsonify, current_app
from . import api_bp
from ..services.prompt_generator_service import generate_prompt_with_llm
from ..services.prompt_service import create_prompt

@api_bp.route('/generate-prompt', methods=['POST'])
def generate_prompt_route():
    """Generate a prompt using LLM"""
    data = request.json
    
    if not data or not data.get('user_description'):
        return jsonify({'error': 'User description is required'}), 400
    
    user_description = data.get('user_description')
    template_id = data.get('template_id')
    temperature = data.get('temperature', 0.7)
    save_prompt = data.get('save_prompt', False)
    prompt_name = data.get('prompt_name', 'Generated Prompt')
    language = data.get('language', 'chinese')  # Default to Chinese if not specified
    
    try:
        # Generate the prompt
        generated_prompt = generate_prompt_with_llm(
            user_description=user_description,
            template_id=template_id,
            temperature=temperature,
            language=language
        )
        
        # Save the prompt if requested
        saved_prompt = None
        if save_prompt:
            saved_prompt = create_prompt(
                name=prompt_name,
                content=generated_prompt,
                source='generated'
            )
            
        response = {
            'generated_prompt': generated_prompt,
        }
        
        if saved_prompt:
            response['saved_prompt'] = saved_prompt.to_dict()
            
        return jsonify(response)
        
    except ValueError as e:
        current_app.logger.error(f"Value error in prompt generation: {str(e)}")
        return jsonify({
            'error': str(e),
            'error_type': 'value_error',
            'suggestions': [
                '检查您的API密钥是否正确配置',
                '尝试降低生成的token数量',
                '尝试使用不同的模型'
            ]
        }), 400
    except Exception as e:
        current_app.logger.error(f"Error in prompt generation: {str(e)}")
        return jsonify({
            'error': f'An error occurred during prompt generation: {str(e)}',
            'error_type': 'system_error',
            'suggestions': [
                '检查网络连接',
                '确保API密钥已正确配置',
                '稍后重试'
            ]
        }), 500 
"""
Prompt Generator Service Module

This module provides services for generating prompts using large language models.
It uses the system prompt from prompt_generator.py as a base and can incorporate
templates from the database to guide the prompt format.
"""

from typing import Dict, Optional
from flask import current_app

from ..models.prompt_template import PromptTemplate
from ..prompt.prompt_generator import SYSTEM_PROMPT_CHINESE, SYSTEM_PROMPT_ENGLISH
from ..services.llm_service import execute_prompt

def generate_prompt_with_llm(
    user_description: str,
    template_id: Optional[int] = None,
    temperature: float = 0.7,
    language: str = 'chinese'
) -> str:
    """
    Generate a prompt based on user description and optionally a template.
    
    Args:
        user_description: User's description for what kind of prompt they want
        template_id: Optional ID of a template to use as the output format
        temperature: Temperature setting for LLM generation
        language: Language for the prompt generation ('chinese' or 'english')
        
    Returns:
        str: The generated prompt content
    
    Raises:
        ValueError: If the specified template is not found
        Exception: If the LLM service fails
    """
    try:
        final_prompt = _build_prompt(user_description, template_id, language)
        
        # Generate prompt using LLM service
        generated_prompt = execute_prompt(
            prompt=final_prompt,
            temperature=temperature
        )
        
        # 确保得到的结果不为空
        if not generated_prompt or len(generated_prompt.strip()) == 0:
            raise ValueError("生成的提示词为空，请重试")
            
        return generated_prompt
    except Exception as e:
        current_app.logger.error(f"Error generating prompt: {str(e)}")
        # 直接抛出异常，不再使用mock
        raise

def _build_prompt(
    user_description: str,
    template_id: Optional[int] = None,
    language: str = 'chinese'
) -> str:
    """
    Build the complete prompt to send to the LLM.
    
    Args:
        user_description: User's description for what kind of prompt they want
        template_id: Optional ID of a template to use as the output format
        language: Language for the prompt generation ('chinese' or 'english')
        
    Returns:
        str: The full prompt to send to the LLM
        
    Raises:
        ValueError: If the specified template is not found
    """
    # Select the appropriate system prompt based on language
    system_prompt = SYSTEM_PROMPT_CHINESE if language == 'chinese' else SYSTEM_PROMPT_ENGLISH
    
    # If template_id is provided, get the template content to include in the prompt
    template_content = None
    if template_id:
        template = PromptTemplate.query.get(template_id)
        if not template:
            raise ValueError(f"Template with ID {template_id} not found")
        template_content = template.content
    
    # Create the full prompt with system and user content
    final_prompt = system_prompt + "\n\n"
    
    # If template content is available, include it in the prompt
    if template_content:
        if language == 'chinese':
            final_prompt += f"请根据以下格式为我创建一个提示词:\n\n{template_content}\n\n用户需求: {user_description}"
        else:
            final_prompt += f"Please create a prompt for me based on the following format:\n\n{template_content}\n\nUser requirement: {user_description}"
    else:
        if language == 'chinese':
            final_prompt += f"用户需求: {user_description}"
        else:
            final_prompt += f"User requirement: {user_description}"
            
    return final_prompt 
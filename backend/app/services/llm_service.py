import os
import openai
from flask import current_app
from .model_service import get_model, get_default_model
from typing import Optional, Dict, Any
import anthropic

def execute_prompt(
    prompt: str,
    model_id: Optional[str] = None,
    temperature: float = 0.7,
    max_tokens: int = 2000
) -> str:
    """
    Execute a prompt using the specified LLM or the default model.
    
    Args:
        prompt: The prompt text to send to the LLM
        model_id: Optional model ID to use (if not provided, will use default)
        temperature: Temperature parameter for generation
        max_tokens: Maximum tokens to generate
        
    Returns:
        str: The generated response
    """
    from ..models.model_config import ModelConfig
    
    # 尝试从数据库获取或使用环境变量
    try:
        # If no model_id is provided, use the default model
        if not model_id:
            default_model = ModelConfig.query.filter_by(is_default=True).first()
            if default_model:
                model_id = default_model.id
            else:
                # If no default model, use the first available model
                first_model = ModelConfig.query.first()
                if first_model:
                    model_id = first_model.id
                else:
                    raise ValueError("No models available")
        
        # Get model configuration
        model_config = ModelConfig.query.get(model_id)
        if not model_config:
            raise ValueError(f"Model with ID {model_id} not found")
        
        # Execute based on model provider
        if model_config.api_type.lower() == 'openai':
            return _execute_openai(model_config.model_id, prompt, temperature, max_tokens)
        elif model_config.api_type.lower() == 'anthropic':
            return _execute_anthropic(model_config.model_id, prompt, temperature, max_tokens)
        else:
            raise ValueError(f"Unsupported provider: {model_config.api_type}")
            
    except Exception as e:
        current_app.logger.error(f"LLM execution error: {str(e)}")
        raise

def _execute_openai(model_name: str, prompt: str, temperature: float, max_tokens: int) -> str:
    """Execute prompt using OpenAI API"""
    client = _get_openai_client()
    
    try:
        # OpenRouter格式的请求
        messages = [{"role": "user", "content": prompt}]
        headers = {}
        
        # 检查是否是使用OpenRouter
        if hasattr(client, 'base_url') and client.base_url and isinstance(client.base_url, str) and "openrouter.ai" in client.base_url:
            current_app.logger.info(f"Using OpenRouter with model: {model_name}")
            headers = {"HTTP-Referer": "https://promptgenerator.app", "X-Title": "Prompt Generator"}
            
        # 增加超时设置和重试逻辑
        response = client.chat.completions.create(
            model=model_name,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            timeout=60,  # 设置60秒超时
            extra_headers=headers
        )
        
        if not response.choices or len(response.choices) == 0:
            raise ValueError("No response generated from the model")
            
        return response.choices[0].message.content
    except Exception as e:
        current_app.logger.error(f"OpenAI API error: {str(e)}")
        raise ValueError(f"OpenAI API error: {str(e)}")

def _execute_anthropic(model_name: str, prompt: str, temperature: float, max_tokens: int) -> str:
    """Execute prompt using Anthropic API"""
    client = _get_anthropic_client()
    
    try:
        response = client.messages.create(
            model=model_name,
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature,
            max_tokens=max_tokens
        )
        return response.content[0].text
    except Exception as e:
        current_app.logger.error(f"Anthropic API error: {str(e)}")
        raise ValueError(f"Anthropic API error: {str(e)}")

def _get_openai_client():
    """Get an authenticated OpenAI client"""
    # We'll use direct config approach since the import isn't working
    api_key = None
    base_url = None
    
    # 1. Try environment variable
    api_key = os.environ.get('OPENAI_API_KEY')
    base_url = os.environ.get('OPENAI_BASE_URL')
    
    # 2. If not in environment, try database
    if not api_key:
        from ..models.model_config import ModelConfig
        model_config = ModelConfig.query.filter_by(api_type='openai', is_default=True).first()
        if not model_config:
            model_config = ModelConfig.query.filter_by(api_type='openai').first()
            
        if model_config and model_config.api_key:
            api_key = model_config.api_key
            base_url = model_config.base_url
    
    if not api_key:
        raise ValueError("No OpenAI API key found in environment or database")
    
    client_kwargs = {
        'api_key': api_key,
        'timeout': 60.0,  # 设置60秒连接超时
        'max_retries': 2  # 最多重试2次
    }
    
    # 如果提供了自定义base_url，添加到客户端配置
    # 确保base_url是字符串，不是其他类型
    if base_url and isinstance(base_url, str):
        client_kwargs['base_url'] = base_url
        
    # Configure the client with timeout settings
    current_app.logger.info(f"Creating OpenAI client with base_url: {base_url} (type: {type(base_url).__name__})")
    return openai.OpenAI(**client_kwargs)

def _get_anthropic_client():
    """Get an authenticated Anthropic client"""
    # We'll use direct config approach since the import isn't working
    api_key = None
    
    # 1. Try environment variable
    api_key = os.environ.get('ANTHROPIC_API_KEY')
    
    # 2. If not in environment, try database
    if not api_key:
        from ..models.model_config import ModelConfig
        model_config = ModelConfig.query.filter_by(api_type='anthropic').first()
        if model_config and model_config.api_key:
            api_key = model_config.api_key
    
    if not api_key:
        raise ValueError("No Anthropic API key found in environment or database")
    
    # Configure the client with timeout settings
    return anthropic.Anthropic(
        api_key=api_key,
        timeout=60.0  # 设置60秒连接超时
    ) 
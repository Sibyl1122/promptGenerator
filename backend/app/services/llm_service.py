import os
import openai
from flask import current_app

def execute_prompt(prompt, provider=None, model=None, temperature=None, max_tokens=None):
    """Execute a prompt using an LLM service"""
    # Get configuration from app config
    if not provider:
        provider = current_app.config.get('DEFAULT_PROVIDER')
    
    if not model:
        model = current_app.config.get('DEFAULT_MODEL')
    
    if not temperature:
        temperature = current_app.config.get('DEFAULT_TEMPERATURE')
    
    if not max_tokens:
        max_tokens = current_app.config.get('DEFAULT_MAX_TOKENS')
    
    # Get provider configuration
    providers = current_app.config.get('LLM_PROVIDERS')
    if provider not in providers:
        raise ValueError(f"Provider {provider} is not configured")
    
    provider_config = providers[provider]
    
    # Execute based on API type
    if provider_config['api_type'] == 'open_ai' or provider_config['api_type'] == 'openai':
        return execute_openai_compatible(
            prompt=prompt, 
            model=model, 
            temperature=temperature, 
            max_tokens=max_tokens,
            api_key=provider_config['api_key'],
            base_url=provider_config['base_url']
        )
    else:
        raise ValueError(f"API type {provider_config['api_type']} is not supported")

def execute_openai_compatible(prompt, model, temperature, max_tokens, api_key, base_url):
    """Execute a prompt using OpenAI-compatible API"""
    if not api_key:
        raise ValueError("API key is not configured")
    
    # Configure the OpenAI client
    client = openai.OpenAI(
        api_key=api_key,
        base_url=base_url
    )
    
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=temperature,
        max_tokens=max_tokens
    )
    
    return response.choices[0].message.content 
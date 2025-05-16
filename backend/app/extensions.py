"""
Flask extensions and configuration variables
"""
import os
import tomllib
from pathlib import Path

def init_extensions(app):
    """Initialize Flask extensions and configuration variables"""
    
    # Load config.toml file
    config_path = Path(__file__).resolve().parent.parent / "config" / "config.toml"
    
    if config_path.exists():
        with config_path.open("rb") as f:
            config_data = tomllib.load(f)
            
        # Load LLM configuration from config.toml file
        app.config['DEFAULT_PROVIDER'] = config_data.get('DEFAULT_PROVIDER', 'openai')
        app.config['DEFAULT_MODEL'] = config_data.get('DEFAULT_MODEL', 'gpt-3.5-turbo')
        app.config['DEFAULT_TEMPERATURE'] = config_data.get('DEFAULT_TEMPERATURE', 0.7)
        app.config['DEFAULT_MAX_TOKENS'] = config_data.get('DEFAULT_MAX_TOKENS', 4096)
        
        # Set up LLM providers from config.toml
        app.config['LLM_PROVIDERS'] = {}
        
        # Add OpenAI provider from LLM_PROVIDERS section if it exists
        if 'LLM_PROVIDERS' in config_data and 'openai' in config_data['LLM_PROVIDERS']:
            app.config['LLM_PROVIDERS']['openai'] = config_data['LLM_PROVIDERS']['openai']
        else:
            # Otherwise, use the main llm section
            llm_config = config_data.get('llm', {})
            app.config['LLM_PROVIDERS']['openai'] = {
                'api_type': llm_config.get('api_type', 'openai'),
                'api_key': llm_config.get('api_key', os.environ.get('OPENAI_API_KEY', '')),
                'base_url': llm_config.get('base_url', 'https://api.openai.com/v1')
            }
    else:
        # Default configuration if config.toml doesn't exist
        app.logger.warning("No config.toml file found. Using default configuration.")
        app.config['DEFAULT_PROVIDER'] = 'openai'
        app.config['DEFAULT_MODEL'] = 'gpt-3.5-turbo'
        app.config['DEFAULT_TEMPERATURE'] = 0.7
        app.config['DEFAULT_MAX_TOKENS'] = 4096
        
        app.config['LLM_PROVIDERS'] = {
            'openai': {
                'api_type': 'openai',
                'api_key': os.environ.get('OPENAI_API_KEY', ''),
                'base_url': 'https://api.openai.com/v1'
            }
        }
    
    return app 
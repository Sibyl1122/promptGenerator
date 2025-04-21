import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Flask configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-for-development'
    DEBUG = os.environ.get('FLASK_ENV') == 'development'
    
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///prompt_generator.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # API Keys for LLM services
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    ANTHROPIC_API_KEY = os.environ.get('ANTHROPIC_API_KEY')
    
    # LLM configuration
    LLM_PROVIDERS = {
        'openai': {
            'api_key': os.environ.get('OPENAI_API_KEY'),
            'base_url': os.environ.get('OPENAI_BASE_URL', 'https://api.openai.com/v1'),
            'api_type': 'openai',
            'models': ['gpt-3.5-turbo', 'gpt-4']
        },
        'qwen': {
            'api_key': os.environ.get('QWEN_API_KEY', 'EMPTY'),
            'base_url': os.environ.get('QWEN_BASE_URL', 'http://8.211.150.31:8000/v1'),
            'api_type': 'open_ai',
            'models': [os.environ.get('QWEN_MODEL', 'Qwen/Qwen2.5-7B-Instruct')]
        }
    }
    
    # Default model configuration
    DEFAULT_PROVIDER = os.environ.get('DEFAULT_PROVIDER', 'openai')
    DEFAULT_MODEL = os.environ.get('DEFAULT_MODEL', 'gpt-3.5-turbo')
    DEFAULT_TEMPERATURE = float(os.environ.get('DEFAULT_TEMPERATURE', 0.7))
    DEFAULT_MAX_TOKENS = int(os.environ.get('DEFAULT_MAX_TOKENS', 1000)) 
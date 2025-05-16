from ..models import db
from ..models.model_config import ModelConfig
from ..config.config import Config

# 实例化Config类
config = Config()

def get_models():
    """Get all active model configurations"""
    return ModelConfig.query.filter_by(status='active').all()

def get_model(model_id):
    """Get a model configuration by ID"""
    return ModelConfig.query.filter_by(id=model_id, status='active').first()

def get_default_model():
    """Get the default model configuration"""
    default_model = ModelConfig.query.filter_by(is_default=True, status='active').first()
    
    # If no default model is set, try to create one from config
    if not default_model:
        default_model = _create_default_from_config()
        
    return default_model

def _create_default_from_config():
    """Create a default model entry from the config file"""
    try:
        default_llm = config.llm.get('default') 
        if default_llm:
            model = ModelConfig(
                name="Default Model",
                model_id=default_llm.get('model', 'gpt-3.5-turbo'),
                base_url=default_llm.get('base_url', 'https://api.openai.com/v1'),
                api_key=default_llm.get('api_key', ''),
                api_type=default_llm.get('api_type', 'openai'),
                api_version=default_llm.get('api_version', ''),
                is_default=True
            )
            
            db.session.add(model)
            db.session.commit()
            return model
    except Exception as e:
        print(f"Error creating default model: {e}")
    
    return None

def create_model(name, model_id, base_url, api_key, api_type='openai', api_version='', is_default=False):
    """Create a new model configuration"""
    # If this model is set as default, unset any existing default
    if is_default:
        _unset_current_default()
    
    model = ModelConfig(
        name=name,
        model_id=model_id,
        base_url=base_url,
        api_key=api_key,
        api_type=api_type,
        api_version=api_version,
        is_default=is_default
    )
    
    db.session.add(model)
    db.session.commit()
    
    return model

def update_model(model_id, name=None, model_id_new=None, base_url=None, api_key=None, api_type=None, api_version=None, is_default=None):
    """Update a model configuration"""
    model = get_model(model_id)
    
    if not model:
        return None
    
    if name:
        model.name = name
    
    if model_id_new:
        model.model_id = model_id_new
    
    if base_url:
        model.base_url = base_url
    
    if api_key:
        model.api_key = api_key
    
    if api_type:
        model.api_type = api_type
    
    if api_version:
        model.api_version = api_version
    
    if is_default is not None:
        if is_default and not model.is_default:
            _unset_current_default()
            model.is_default = True
        elif not is_default and model.is_default:
            # Don't allow unsetting default without setting another
            pass
    
    db.session.commit()
    
    return model

def delete_model(model_id):
    """Delete a model configuration (soft delete)"""
    model = get_model(model_id)
    
    if not model:
        return False
    
    # Don't allow deleting the default model
    if model.is_default:
        return False
    
    model.status = 'deleted'
    db.session.commit()
    
    return True

def set_default_model(model_id):
    """Set a model as the default"""
    model = get_model(model_id)
    
    if not model:
        return False
    
    _unset_current_default()
    
    model.is_default = True
    db.session.commit()
    
    return True

def _unset_current_default():
    """Unset any current default model"""
    default_models = ModelConfig.query.filter_by(is_default=True).all()
    for model in default_models:
        model.is_default = False
    
    db.session.commit() 
from datetime import datetime
from . import db

class ModelConfig(db.Model):
    __tablename__ = 'model_config'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    model_id = db.Column(db.String(255), nullable=False)
    base_url = db.Column(db.String(255), nullable=False)
    api_key = db.Column(db.String(255), nullable=True)
    api_type = db.Column(db.String(50), default='openai')
    api_version = db.Column(db.String(50), default='')
    is_default = db.Column(db.Boolean, default=False)
    created_time = db.Column(db.DateTime, default=datetime.utcnow)
    updated_time = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    status = db.Column(db.String(50), default='active')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'model_id': self.model_id,
            'base_url': self.base_url,
            'api_key': self.api_key.replace(self.api_key[4:-4], '*******') if self.api_key else None,
            'api_type': self.api_type,
            'api_version': self.api_version,
            'is_default': self.is_default,
            'created_time': self.created_time.isoformat() if self.created_time else None,
            'updated_time': self.updated_time.isoformat() if self.updated_time else None,
            'status': self.status
        } 
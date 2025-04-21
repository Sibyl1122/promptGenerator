from datetime import datetime
from . import db

class Prompt(db.Model):
    __tablename__ = 'prompt'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    latest_version = db.Column(db.Integer, default=1)
    created_time = db.Column(db.DateTime, default=datetime.utcnow)
    updated_time = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    status = db.Column(db.String(50), default='active')
    source = db.Column(db.String(50), default='user')
    
    # Relationships
    versions = db.relationship('PromptVersion', backref='prompt', lazy='dynamic')
    shots = db.relationship('PromptShots', backref='prompt', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'latest_version': self.latest_version,
            'created_time': self.created_time.isoformat() if self.created_time else None,
            'updated_time': self.updated_time.isoformat() if self.updated_time else None,
            'status': self.status,
            'source': self.source
        } 
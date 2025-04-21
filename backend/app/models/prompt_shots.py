from datetime import datetime
from . import db

class PromptShots(db.Model):
    __tablename__ = 'prompt_shots'
    
    id = db.Column(db.Integer, primary_key=True)
    prompt_id = db.Column(db.Integer, db.ForeignKey('prompt.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_time = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'prompt_id': self.prompt_id,
            'content': self.content,
            'created_time': self.created_time.isoformat() if self.created_time else None
        } 
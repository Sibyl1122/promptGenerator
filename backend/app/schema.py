"""
数据模型定义
"""
from typing import Dict, List, Optional, Union, Literal

# 角色类型定义
ROLE_VALUES = ["user", "assistant", "system", "tool", "function"]
RoleType = Literal["user", "assistant", "system", "tool", "function"]

# 工具选择类型定义
TOOL_CHOICE_VALUES = ["none", "auto", "required"]
TOOL_CHOICE_TYPE = Union[Literal["none", "auto", "required"], Dict[str, str]]


class ToolChoice:
    """工具选择枚举"""
    NONE = "none"
    AUTO = "auto"
    REQUIRED = "required"


class Message:
    """消息类"""
    
    @staticmethod
    def user_message(content: str) -> Dict:
        """创建用户消息"""
        return {"role": "user", "content": content}
    
    @staticmethod
    def system_message(content: str) -> Dict:
        """创建系统消息"""
        return {"role": "system", "content": content}
    
    @staticmethod
    def assistant_message(content: str) -> Dict:
        """创建助手消息"""
        return {"role": "assistant", "content": content}
    
    def __init__(
        self,
        role: RoleType,
        content: Optional[str] = None,
        name: Optional[str] = None,
        function_call: Optional[Dict] = None,
        tool_calls: Optional[List[Dict]] = None,
        tool_call_id: Optional[str] = None,
        base64_image: Optional[str] = None,
    ):
        self.role = role
        self.content = content
        self.name = name
        self.function_call = function_call
        self.tool_calls = tool_calls
        self.tool_call_id = tool_call_id
        self.base64_image = base64_image
    
    def to_dict(self) -> Dict:
        """转换为字典"""
        result = {"role": self.role}
        
        if self.content is not None:
            result["content"] = self.content
        
        if self.name:
            result["name"] = self.name
            
        if self.function_call:
            result["function_call"] = self.function_call
            
        if self.tool_calls:
            result["tool_calls"] = self.tool_calls
            
        if self.tool_call_id:
            result["tool_call_id"] = self.tool_call_id
            
        if self.base64_image:
            result["base64_image"] = self.base64_image
            
        return result


# 为了支持token限制异常
class TokenLimitExceeded(Exception):
    """当令牌超过限制时引发的异常"""
    pass

import threading
import tomllib
from pathlib import Path
from typing import Dict, List, Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    _instance = None
    _lock = threading.Lock()
    _initialized = False

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if not self._initialized:
            with self._lock:
                if not self._initialized:
                    self._config = None
                    self._load_initial_config()
                    self._initialized = True

    @staticmethod
    def _get_config_path() -> Path:
        root = Path(__file__).resolve().parent.parent
        config_path = root / "config" / "config.toml"
        if config_path.exists():
            return config_path
        example_path = root / "config" / "config.example.toml"
        if example_path.exists():
            return example_path
        raise FileNotFoundError("No configuration file found in config directory")

    def _load_config(self) -> dict:
        config_path = self._get_config_path()
        with config_path.open("rb") as f:
            return tomllib.load(f)

    def _load_initial_config(self):
        raw_config = self._load_config()
        
        # 数据库配置
        db_config = raw_config.get("database", {})
        self._database_uri = db_config.get("uri", "sqlite:///prompt_generator.db")
        self._track_modifications = db_config.get("track_modifications", False)
        self._echo = db_config.get("echo", False)

    @property
    def database(self):
        class DatabaseSettings:
            def __init__(self, uri, track_modifications, echo):
                self.uri = uri
                self.track_modifications = track_modifications
                self.echo = echo
        
        return DatabaseSettings(
            self._database_uri,
            self._track_modifications,
            self._echo
        )

    @property
    def workspace_root(self) -> Path:
        """Get the workspace root directory"""
        return Path(__file__).resolve().parent.parent / "workspace"

    @property
    def root_path(self) -> Path:
        """Get the root path of the application"""
        return Path(__file__).resolve().parent.parent


config = Config()

from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    env: str = Field(default="development", alias="SAFE_PARK_ENV")
    project_name: str = Field(default="Safe Park", alias="SAFE_PARK_PROJECT_NAME")
    api_host: str = Field(default="0.0.0.0", alias="SAFE_PARK_API_HOST")
    api_port: int = Field(default=8000, alias="SAFE_PARK_API_PORT")
    stream_gateway_port: int = Field(default=8010, alias="SAFE_PARK_STREAM_GATEWAY_PORT")
    database_url: str = Field(alias="SAFE_PARK_DATABASE_URL")
    test_database_url: str = Field(default="sqlite+pysqlite:///:memory:", alias="SAFE_PARK_TEST_DATABASE_URL")
    go2rtc_url: str = Field(default="http://localhost:1984", alias="SAFE_PARK_GO2RTC_URL")
    storage_root: Path = Field(default=Path("./storage"), alias="SAFE_PARK_STORAGE_ROOT")
    demo_mode: bool = Field(default=True, alias="SAFE_PARK_DEMO_MODE")
    redis_url: str | None = Field(default=None, alias="SAFE_PARK_REDIS_URL")
    default_access_token: str = Field(default="demo-safe-park-token", alias="SAFE_PARK_DEFAULT_ACCESS_TOKEN")
    default_admin_email: str = Field(default="admin@safepark.local", alias="SAFE_PARK_DEFAULT_ADMIN_EMAIL")
    default_admin_password: str = Field(default="admin123", alias="SAFE_PARK_DEFAULT_ADMIN_PASSWORD")


@lru_cache
def get_settings() -> Settings:
    return Settings()


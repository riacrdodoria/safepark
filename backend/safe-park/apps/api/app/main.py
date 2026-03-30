from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import alerts, artifacts, auth, camera_flow, camera_links, cameras, dashboard, events, rules, sites, spots, system, tracking, zones
from app.core.config import get_settings
from app.core.logging import configure_logging
from app.db.base import Base
from app.db.session import engine


configure_logging()
settings = get_settings()
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.project_name, version="0.1.0", docs_url="/docs", openapi_url="/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3012",
        "http://127.0.0.1:3012",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(sites.router)
app.include_router(cameras.router)
app.include_router(camera_links.router)
app.include_router(zones.router)
app.include_router(spots.router)
app.include_router(rules.router)
app.include_router(events.router)
app.include_router(alerts.router)
app.include_router(artifacts.router)
app.include_router(dashboard.router)
app.include_router(system.router)
app.include_router(tracking.router)
app.include_router(camera_flow.router)


@app.get("/")
def root() -> dict:
    return {"service": "safe-park-api", "status": "ok"}

import pytest

from fastapi import FastAPI

from server import lifespan


@pytest.fixture
def app() -> FastAPI:
    app = FastAPI()
    return app

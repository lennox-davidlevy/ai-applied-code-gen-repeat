import pytest
from fastapi.testclient import TestClient
from server import app
from conftest import lifespan


@pytest.mark.asyncio
async def test_generate_text_endpoint():
    async with lifespan(app):
        client = TestClient(app)
        response = client.post(
            "/generate_pet_name",
            json={
                "llm_name": "pet_namer",
                "prompt_template_name": "pet_namer",
                "prompt_template_kwargs": {
                    "data": "A male ferret who is mischievous, curious, agile, brown",
                },
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert "generated_text" in data
        assert isinstance(data["generated_text"], str)


@pytest.mark.asyncio
async def test_generate_text_endpoint_with_default_llm_and_template():
    async with lifespan(app):
        client = TestClient(app)
        response = client.post(
            "/generate_pet_name",
            json={
                "prompt_template_kwargs": {
                    "data": "A male ferret who is mischievous, curious, agile, brown",
                }
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert "generated_text" in data
        assert isinstance(data["generated_text"], str)

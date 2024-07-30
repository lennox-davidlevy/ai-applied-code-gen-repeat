import pytest
from server import models, prompt_templates, lifespan


@pytest.mark.asyncio
async def test_startup(app):
    async with lifespan(app):
        assert len(models) > 0
        assert len(prompt_templates) > 0

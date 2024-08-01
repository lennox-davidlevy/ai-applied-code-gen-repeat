import json
import os
from typing import Dict, Any
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, status, HTTPException, Body
from langchain_core.output_parsers import StrOutputParser
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser

from routes.models import ModelRequest

from schemas import (
    TestRequest,
    ExamplesTemplate,
    PromptTemplateRequest,
    JSONResponseTemplate,
)

# Set up basic logging
logging.basicConfig(level=logging.INFO)

# Global dictionaries to store models and prompt templates
models: Dict[str, ModelRequest] = {}
prompt_templates: Dict[str, PromptTemplateRequest] = {}
examples_templates: Dict[str, ExamplesTemplate] = {}

# Directory paths for models and prompt templates
MODELS_DIR_PATH = "data/models"
TEMPLATES_DIR_PATH = "data/prompt_templates"
EXAMPLES_DIR_PATH = "data/examples"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Context manager to handle the lifespan of the FastAPI application.
    Loads models and prompt templates from files at startup and
    clears them at shutdown.
    """
    try:
        load_models()
        load_prompt_templates()
        load_examples()
        yield
    finally:
        models.clear()
        prompt_templates.clear()
        examples_templates.clear()


def load_models():
    """
    Load models from JSON files.
    """
    for filename in os.listdir(MODELS_DIR_PATH):
        if filename.endswith(".json"):
            file_path = os.path.join(MODELS_DIR_PATH, filename)
            with open(file_path, "r") as f:
                model_data = json.load(f)
            template_model = filename[:-5]
            model_request = ModelRequest.from_json(model_data)
            models[template_model] = model_request


def load_prompt_templates():
    """
    Load prompt templates from text files.
    """
    for filename in os.listdir(TEMPLATES_DIR_PATH):
        if filename.endswith(".txt"):
            file_path = os.path.join(TEMPLATES_DIR_PATH, filename)
            with open(file_path, "r") as f:
                template = f.read()
            template_name = filename[:-4]
            prompt_templates[template_name] = PromptTemplateRequest(
                template=template)


def load_examples():
    """
    Load examples from text files.
    """
    for filename in os.listdir(EXAMPLES_DIR_PATH):
        if filename.endswith(".txt"):
            file_path = os.path.join(EXAMPLES_DIR_PATH, filename)
            with open(file_path, "r") as f:
                template = f.read()
            template_name = filename[:-4]
            examples_templates[template_name] = ExamplesTemplate(
                template=template)


# Initialize FastAPI app with custom lifespan
app = FastAPI(lifespan=lifespan)


@app.get("/health")
async def health():
    """
    Health check endpoint to see if the API is up and running.
    """
    return {"message": "Fast API up!"}


@app.post("/test_route")
async def test_route(request: TestRequest):
    """
    Test route to ensure the server can receive and return data properly.
    """
    try:
        data = request.data
        return {"data": data}
    except Exception as e:
        logging.error(f"Error in test_route: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate_summary")
async def generate_summary(
    template_model: str = Body(default="generate_summary"),
    prompt_template_name: str = Body(default="generate_summary"),
    prompt_template_kwargs: Dict[str, str] = Body(...),
):
    """
    Endpoint to generate a summary based on provided data.
    """
    response = await generated_text_response(
        template_model, prompt_template_name, prompt_template_kwargs
    )
    return response


async def generated_text_response(
    template_model: str, prompt_template_name: str, prompt_template_kwargs: Dict[str, Any]
) -> str:
    """
    Common functionality to generate a response using a specified model
    and prompt template.

    Args:
        template_model(str): The name of the models type to use.
        prompt_template_name (str): The name of the prompt template to use.
        prompt_template_kwargs (Dict[str, Any]): The keyword arguments for the prompt template.

    Returns:
        str: The generated text response from the model.
    """
    try:
        model_request = models.get(template_model)
        if not model_request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Model with name {template_model} not found",
            )

        prompt_template_request = prompt_templates.get(prompt_template_name)
        if not prompt_template_request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"PromptTemplate with name {prompt_template_name} not found",
            )

        examples = examples_templates.get(
            prompt_template_name, ExamplesTemplate(template="")
        )
        if not examples:
            logging.warning(
                f"Examples for prompt template {prompt_template_name} not found. Using empty string."
            )

        model = model_request.get_model()
        prompt_template = PromptTemplate.from_template(
            template=prompt_template_request.template
        )
        output_parser = StrOutputParser()

        prompt_template_kwargs["examples"] = examples.template

        chain = prompt_template | model | output_parser
        generated_text = chain.invoke(prompt_template_kwargs)

        return generated_text
    except Exception as e:
        logging.error(f"Error in generate_response: {e}")
        raise HTTPException(status_code=500, detail=str(e))

from pydantic import BaseModel


class PromptTemplateRequest(BaseModel):
    template: str

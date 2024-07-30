from pydantic import BaseModel, Field


class JSONResponseTemplate(BaseModel):
    name: str = Field(..., description="The name of the cat")
    description: str = Field(...,
                             description="A description of the cat's name and personality")

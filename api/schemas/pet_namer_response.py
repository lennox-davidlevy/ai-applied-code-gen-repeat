from pydantic import BaseModel


class PetNamerResponse(BaseModel):
    name: str
    description: str


class GeneratePetNameResponse(BaseModel):
    generated_text: PetNamerResponse

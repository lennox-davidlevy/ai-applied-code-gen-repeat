from pydantic import BaseModel


class GenerateSummaryResponse(BaseModel):
    generated_text: str

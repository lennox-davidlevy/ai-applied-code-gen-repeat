from pydantic import BaseModel

class TestRequest(BaseModel):
    """
    TestRequest is a Pydantic model for handling test requests.

    Attributes:
        data (str): The data to be processed in the test request.
    """

    data: str

import os
from typing import Optional, Dict, Any

from pydantic import BaseModel
from langchain_core.language_models.llms import LLM
from dotenv import load_dotenv


from ibm_watsonx_ai import Credentials
from ibm_watsonx_ai.foundation_models import ModelInference
from ibm_watsonx_ai.foundation_models.utils.enums import DecodingMethods
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams
from langchain_ibm import WatsonxLLM

# Load environment variables from a .env file
load_dotenv()


class ModelRequest(BaseModel):
    """
    A Pydantic model that represents a request for a language model.
    """

    id: str
    parameters: Optional[Dict[str, Any]]
    service_provider: Optional[str]

    @classmethod
    def from_json(cls, data: Dict) -> "ModelRequest":
        """
        Create a ModelRequest instance from a JSON dictionary.

        Args:
            data (Dict): The JSON data.

        Returns:
            ModelRequest: An instance of ModelRequest.
        """
        return cls(
            id=data["id"],
            parameters=data.get("parameters"),
            service_provider=data.get("service_provider"),
        )

    def get_model(self) -> LLM:
        """
        Get the language model instance based on the service provider.

        Returns:
            LLM: The language model instance.

        Raises:
            ValueError: If the service provider is not recognized.
        """
        if self.service_provider == "wxai":
            return get_wxai_model(self.id, self.parameters)
        else:
            raise ValueError("Invalid service provider. Must be or 'wxai'")


def set_parameters(model_parameters: Optional[Dict] = None) -> Dict:
    """
    Set the model parameters, applying defaults where necessary and
    handling specific logic for different decoding methods.

    Args:
        model_parameters (Optional[Dict], optional): The model parameters.
        Defaults to None.

    Returns:
        Dict: The complete set of parameters with defaults applied where
        necessary.
    """
    # default parameters for greedy
    default_parameters_for_greedy = {
        GenParams.DECODING_METHOD: DecodingMethods.GREEDY,
        GenParams.MAX_NEW_TOKENS: 200,
        GenParams.MIN_NEW_TOKENS: 0,
        GenParams.STOP_SEQUENCES: [],
        GenParams.REPETITION_PENALTY: 1,
        "include_stop_sequence": False,
    }

    # default parameters for sample
    default_parameters_for_sample = {
        GenParams.DECODING_METHOD: DecodingMethods.SAMPLE,
        GenParams.MAX_NEW_TOKENS: 200,
        GenParams.MIN_NEW_TOKENS: 0,
        GenParams.STOP_SEQUENCES: [],
        GenParams.TEMPERATURE: 0.7,
        GenParams.TOP_K: 50,
        GenParams.TOP_P: 1,
        GenParams.REPETITION_PENALTY: 1,
        "include_stop_sequence": False,
    }

    # if model_parameters is None or empty, return greedy defaults
    # which are the same as the defaults in watsonx.ai prompt studio
    if not model_parameters:
        return default_parameters_for_greedy

    # if decoding method is greedy, return greedy defaults with overrides
    # from model_parameters
    if model_parameters.get(GenParams.DECODING_METHOD) == DecodingMethods.GREEDY:
        return {
            key: model_parameters.get(key, default_parameters_for_greedy[key])
            for key in default_parameters_for_greedy
        }

    # for sample decoding method, merge defaults with model_parameters
    return {
        key: model_parameters.get(key, default_parameters_for_sample[key])
        for key in default_parameters_for_sample
    }

def get_wxai_model(model_id: str, model_parameters: Optional[Dict] = None) -> LLM:
    """
    Get a watsonx.ai language model instance.

    Args:
        model_id (str): The model ID.
        model_parameters (Optional[Dict], optional): The model parameters.
        Defaults to None.

    Returns:
        LLM: The watsonx.ai language model instance.

    Raises:
        Exception: If the model creation fails.
    """
    try:
        if model_parameters is None:
            model_parameters = {}
        apikey = os.environ.get("IBM_APIKEY")
        project_id = os.environ.get("PROJECT_ID")
        url = os.environ.get("WATSON_URL")
        if apikey is None or project_id is None:
            raise ValueError("IBM_APIKEY or PROJECT_ID environment variable is not set")

        parameters = set_parameters(model_parameters)

        credentials = Credentials(
            url=url,
            api_key=apikey,
        )

        model = ModelInference(
            model_id=model_id,
            credentials=credentials,
            params=parameters,
            project_id=project_id,
        )

        return WatsonxLLM(watsonx_model=model)
    except Exception as e:
        raise Exception(f"Failed to create WML model: {str(e)}")


if __name__ == "__main__":
    from langchain.prompts import PromptTemplate
    from langchain_core.output_parsers import StrOutputParser

    model = get_wxai_model(model_id="ibm/granite-20b-multilingual")
    pt2 = PromptTemplate(
        input_variables=["question"],
        template="Answer the following question: {question}",
    )
    chain = pt2 | model | StrOutputParser()
    print(chain.invoke({"question": "What is the meaning of life?"}))

import {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  KeyboardEvent,
} from 'react';
import {
  Form,
  Stack,
  FormGroup,
  Checkbox,
  Heading,
  Button,
  ButtonSet,
  TextInput,
  ComboBox,
  Tile,
  Tag,
  Column,
  Accordion,
  AccordionItem,
  AccordionSkeleton,
} from '@carbon/react';

import { Add, CloseFilled } from '@carbon/icons-react';

import axios from 'axios';

//******************* Animal type data ********************//

import data from './data.json';


//***************** TypeScript interfaces *****************//

interface AnimalType {
  id: string;
  text: string;
}

interface ComboBoxChangeEvent {
  selectedItem: AnimalType;
}

interface FilterItemsParam {
  item: AnimalType;
  inputValue: string;
}

interface RenderedResults {
  name: string;
  description: string;
}

//*********************************************************//

const PetForm = () => {
  // Component Functionality
  // State for dynamic rendering

  //**************** State for dynamic rendering ****************//

  const [disableSubmitButton, setDisableSubmitButton] = useState<boolean>(true);
  const [disableClearButton, setDisableClearButton] = useState<boolean>(true);
  const [disableWhileLoading, setDisableWhileLoading] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);


  //************ State for data to send to API ******************//

  const [typeOfAnimal, setTypeOfAnimal] = useState<AnimalType>({
    id: '',
    text: '',
  });
  const [genderOfAnimal, setGenderOfAnimal] = useState<'male' | 'female' | ''>(
    ''
  );
  const [descriptors, setDescriptors] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');


  //************ State for response from API ********************//

  const [renderedResults, setRenderedResults] = useState<RenderedResults>({
    name: '',
    description: '',
  });
  const [renderedRequest, setRenderedRequest] = useState<Record<
    string,
    any
  > | null>(null);
  const [openAccordion, setOpenAccordion] = useState<boolean>(false);


  //******** Disable Buttons based on state and loading *********//

  useEffect(() => {
    // Every field should have some value
    const shouldDisableSubmit =
      !typeOfAnimal.id ||
      !typeOfAnimal.text ||
      !genderOfAnimal ||
      descriptors.length === 0;

    // If any field has a value, give option to clear
    const shouldDisableClear =
      !typeOfAnimal.id &&
      !typeOfAnimal.text &&
      !genderOfAnimal &&
      descriptors.length === 0;

    setDisableSubmitButton(shouldDisableSubmit);
    setDisableClearButton(shouldDisableClear);
  }, [typeOfAnimal, genderOfAnimal, descriptors]);

  useEffect(() => {
    setDisableWhileLoading(loading);
  }, [loading]);


  //**************** ComboBox Functionality **********************//

  const handleComboBoxChange = useCallback((item: ComboBoxChangeEvent) => {
    const { selectedItem } = item;
    setTypeOfAnimal(selectedItem || { id: '', text: '' });
  }, []);

  const sortComboBox = (item: AnimalType) => {
    return item ? item.text : '';
  };

  const filterItems = (menu: FilterItemsParam) => {
    return menu?.item?.text
      ?.toLowerCase()
      .includes(menu?.inputValue?.toLowerCase());
  };


  //****************** Descriptor Functionality ******************//

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const handleAddDescriptor = useCallback(() => {
    if (inputValue.trim()) {
      setDescriptors((prev) => [...prev, inputValue.trim()]);
      setInputValue('');
    }
  }, [inputValue]);

  const handleClearDescriptorFromList = useCallback((str: string) => {
    setDescriptors((prevDescriptors) =>
      prevDescriptors.filter((descriptor) => descriptor !== str)
    );
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleAddDescriptor();
    }
  };

  //******************** Submit Functionality ********************//

  const handleSubmit = async () => {
    // grab the descriptor strings from the array and join them into a comma seperated string
      // interpolate all the data collected from the form into a single string

    try {
      // Set loading to true
      // Make API call
        // extract relevant data from response
          // set response name and description to state 
          // set data sent to API to state
          // open accordions
    } catch (err) {
      // log error
      console.log(err);
    } finally {
      // set loading to false
    }
  };

  //******************** Clear Functionality *********************//

  const handleClear = () => {
    setDescriptors([]);
    setGenderOfAnimal('');
    setInputValue('');
    setTypeOfAnimal({ id: '', text: '' });
    setRenderedResults({ name: '', description: '' });
    setRenderedRequest(null);
    setOpenAccordion(false);
  };

  return (
    <>
      <Column sm={2} md={4} lg={8} className='pet-form-container'>
        <Form aria-label='Pet Form'>
          <Stack gap={7}>
            <div>Pet Form!</div>
          </Stack>
        </Form>
      </Column>
      <Column sm={2} md={4} lg={8}>
        <Stack gap={8}>
          <div>Results!</div>
        </Stack>
      </Column>
    </>
  );
};

export default PetForm;

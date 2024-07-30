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

  // error variable to add a retry button
  const [error, setError] = useState<boolean>(false);

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

  //********************* UseEffect Loggins **********************//
  useEffect(() => {
    if (!descriptors || descriptors.length === 0) return;
    console.log('Descriptors: ');
    console.log(descriptors);
  }, [descriptors]);

  //******************** Submit Functionality ********************//

  const handleSubmit = async () => {
    // grab the descriptor strings from the array and join them into a comma seperated string
    const descriptorsString = descriptors.join(', ');
    // interpolate all the data collected from the form into a single string
    const stringToSendToAPI = `A ${
      genderOfAnimal === 'male' ? 'male' : 'female'
    } ${typeOfAnimal.text.toLowerCase()} who is ${descriptorsString}`;
    try {
      // Set loading to true
      setLoading(true);
      setError(false);
      // Make API call
      const result = await axios.post('/api/pet_namer/generate_pet_name', {
        data: stringToSendToAPI,
      });

      // extract relevant data from response
      const obj = result.data.generated_text;
      const requestSentToAPI = result.data.request_sent_to_llm;
      // set response name and description to state
      setRenderedResults(obj);
      // set data sent to API to state
      setRenderedRequest(requestSentToAPI);
      // open accordions
      setOpenAccordion(true);
    } catch (err) {
      // log error
      console.log(err);
      setError(true);
    } finally {
      // set loading to false
      setLoading(false);
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
    setError(false);
  };

  return (
    <>
      <Column sm={2} md={4} lg={8} className='pet-form-container'>
        <Form aria-label='Pet Form'>
          <Stack gap={7}>
            <Heading className='form_group__heading'>
              Describe your future pet!
            </Heading>

            <ComboBox
              onChange={handleComboBoxChange}
              id='type-of-animal-combobox'
              items={data}
              itemToString={sortComboBox}
              titleText='Type of Animal'
              shouldFilterItem={filterItems}
              selectedItem={typeOfAnimal}
              disabled={disableWhileLoading}
            />
            <FormGroup legendText='Pet Gender'>
              <Checkbox
                id='male_checkbox'
                labelText='Male'
                checked={genderOfAnimal === 'male'}
                onChange={() =>
                  setGenderOfAnimal(genderOfAnimal === 'male' ? '' : 'male')
                }
                disabled={disableWhileLoading}
              />
              <Checkbox
                id='female_checkbox'
                labelText='Female'
                checked={genderOfAnimal === 'female'}
                onChange={() =>
                  setGenderOfAnimal(genderOfAnimal === 'female' ? '' : 'female')
                }
                disabled={disableWhileLoading}
              />
            </FormGroup>
            <div className='input-button-container'>
              <TextInput
                id='add-descriptor'
                labelText='Add Descriptors'
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={disableWhileLoading}
              />
              <Button
                hasIconOnly
                iconDescription='Add Descriptor'
                renderIcon={Add}
                tooltipAlignment='start'
                tooltipPosition='top'
                onClick={handleAddDescriptor}
                disabled={inputValue.length === 0 || disableWhileLoading}
              />
            </div>

            <Tile>
              {descriptors.map((descriptor, index) => (
                <span
                  key={index}
                  onClick={() => handleClearDescriptorFromList(descriptor)}
                >
                  <Tag
                    key={index}
                    className='descriptor-tag'
                    renderIcon={CloseFilled}
                    disabled={disableWhileLoading}
                  >
                    {descriptor}
                  </Tag>
                </span>
              ))}
            </Tile>

            <ButtonSet>
              <Button
                type='button'
                kind='secondary'
                onClick={handleClear}
                disabled={!!disableClearButton || disableWhileLoading}
              >
                Clear
              </Button>
              <Button
                type='button'
                onClick={handleSubmit}
                disabled={disableSubmitButton || disableWhileLoading}
              >
                Submit
              </Button>
              {error && (
                <Button
                  type='button'
                  kind='danger'
                  onClick={handleSubmit}
                  disabled={disableSubmitButton || disableWhileLoading}
                >
                  Retry
                </Button>
              )}
            </ButtonSet>
          </Stack>
        </Form>
      </Column>
      <Column sm={2} md={4} lg={8}>
        <Stack gap={8}>
          <Heading className='form_group__heading'>Result</Heading>
          {loading ? (
            <AccordionSkeleton count={3} open={false} />
          ) : (
            <Accordion>
              <AccordionItem title='Name' open={openAccordion}>
                {renderedResults.name && (
                  <span className='bold-text'>{renderedResults.name}</span>
                )}
              </AccordionItem>
              <AccordionItem title='Description' open={openAccordion}>
                {renderedResults.description && renderedResults.description}
              </AccordionItem>
              <AccordionItem
                title='Data sent to API'
                className='accordian-request'
              >
                {renderedRequest && (
                  <pre className='accordion-content'>
                    {JSON.stringify(renderedRequest, null, 2)}
                  </pre>
                )}
              </AccordionItem>
            </Accordion>
          )}
        </Stack>
      </Column>
    </>
  );
};

export default PetForm;

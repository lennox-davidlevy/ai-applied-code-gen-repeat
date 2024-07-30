// Carbon Imports
import {
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Grid,
  Column,
} from '@carbon/react';

// Component Imports
import PetForm from '../PetForm';

export default function LandingPage() {
  return (
    <Grid className='landing-page' fullWidth>
      <Column lg={16} md={8} sm={4} className='landing-page__banner'>
        <Breadcrumb aria-label='Page navigation'>
          <BreadcrumbItem className='landing-page__breadcrumb'>
            <a href='/'>Home</a>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1 className='landing-page__heading'>AI Applied Demo</h1>
      </Column>
      <Column lg={16} md={8} sm={4} className='landing-page__r2'>
        <Tabs defaultSelectedIndex={0}>
          <TabList className='tabs-group' aria-label='Page navigation'>
            <Tab>Name your pet</Tab>
            <Tab>Chat with your docs</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Grid className='tabs-group-content' fullWidth>
                <PetForm />
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid className='tabs-group-content'>
                <Column sm={2} md={4} lg={6}>
                  Upload some interesting docs and then ask questions about
                  them!
                </Column>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Column>
    </Grid>
  );
}

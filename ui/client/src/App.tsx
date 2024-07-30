import { Theme, Content } from '@carbon/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import CarbonHeader from './components/Header';
import { AppProvider } from './context/AppContext';
import './App.scss';

const App = () => {
  return (
    <Router>
      <AppProvider>
        <Theme theme="g90">
          <CarbonHeader />
          <Content>
            <Routes>
              <Route path="/" element={<Landing />} />
            </Routes>
          </Content>
        </Theme>
      </AppProvider>
    </Router>
  );
};

export default App;

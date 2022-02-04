import React from 'react';
import LoginProvider from './utils/LoginProvider';
import AppStack from './komponente/AppStack';

const App = () => {
  return (
    <LoginProvider>
      <AppStack />
    </LoginProvider>
  );
};

export default App;

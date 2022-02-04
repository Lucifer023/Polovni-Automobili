import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Oglas from './Oglas';
import OglasDetalji from './OglasDetalji';
import Oglasi from './Oglasi';

const Stack = createStackNavigator();

const OglasStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Svi oglasi" component={Oglasi} />
      <Stack.Screen name="Oglas" component={Oglas} />
      <Stack.Screen name="Oglas detalji" component={OglasDetalji} />
    </Stack.Navigator>
  );
};

export default OglasStack;

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DodajOglas from './DodajOglas';
import PrikaziSveOznaceneSlike from '../pomocneKomponente/PrikaziSveOznaceneSlike';

const Stack = createStackNavigator();

const DodajOglasStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Kreiraj oglas" component={DodajOglas} />
      <Stack.Screen name="Slike oglasa" component={PrikaziSveOznaceneSlike} />
    </Stack.Navigator>
  );
};

export default DodajOglasStack;

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import VasiOglasi from './VasiOglasi';
import OglasDetalji from './OglasDetalji';
import IzmeniOglas from './IzmeniOglas';
import PrikaziSveOznaceneSlike from '../pomocneKomponente/PrikaziSveOznaceneSlike';

const Stack = createStackNavigator();

const VasiOglasiStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Vasi oglasi" component={VasiOglasi} />
      <Stack.Screen name="Oglas detalji" component={OglasDetalji} />
      <Stack.Screen name="Izmeni oglas" component={IzmeniOglas} />
      <Stack.Screen
        name="Slike oglasa koji se menja"
        component={PrikaziSveOznaceneSlike}
      />
    </Stack.Navigator>
  );
};

export default VasiOglasiStack;

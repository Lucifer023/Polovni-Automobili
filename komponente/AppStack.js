import 'react-native-gesture-handler';
import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import EkranZaPrijavu from '../komponente/EkranZaPrijavu';
import EkranZaUcitavanje from '../komponente/EkranZaUcitavanje';
import CustomDrawerComponent from '../komponente/CustomDrawerComponent';
import {LoginContext} from '../utils/LoginProvider';
import DodajOglasStack from './DodajOglasStack';
import OglasStack from './OglasStack';
import VasiOglasiStack from './VasiOglasiStack';
import PretragaOglasa from './PretragaOglasa';

const Drawer = createDrawerNavigator();

const AppStack = () => {
  const {korisnik, isLoading} = useContext(LoginContext);
  return (
    <>
      {isLoading ? (
        <EkranZaUcitavanje />
      ) : korisnik ? (
        <NavigationContainer>
          <Drawer.Navigator
            drawerContent={props => <CustomDrawerComponent {...props} />}
            screenOptions={{swipeEdgeWidth: 50}}>
            <Drawer.Screen name="Oglasi" component={OglasStack} />
            <Drawer.Screen name="Pretraga oglasa" component={PretragaOglasa} />
            <Drawer.Screen name="Dodaj oglas" component={DodajOglasStack} />
            <Drawer.Screen name="Vaši oglasi" component={VasiOglasiStack} />
          </Drawer.Navigator>
        </NavigationContainer>
      ) : (
        <EkranZaPrijavu />
      )}
    </>
  );
};

export default AppStack;

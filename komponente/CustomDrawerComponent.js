import React from 'react';
import {signOut} from '../utils/FirebaseUtil';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomDrawerComponent = props => {
  return (
    <DrawerContentScrollView
      contentContainerStyle={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}
      {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        style={{flex: 1, justifyContent: 'flex-end'}}
        label="Odjavi se"
        onPress={() =>
          signOut()
            .then(() => AsyncStorage.removeItem('uid'))
            .catch(e => alert('Došlo je do greške !'))
        }
      />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerComponent;

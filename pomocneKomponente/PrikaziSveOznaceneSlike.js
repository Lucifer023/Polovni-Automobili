import React from 'react';
import {View, Image, ScrollView, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const PrikaziSveOznaceneSlike = ({route}) => {
  const {slike} = route.params;
  return (
    <View>
      <ScrollView horizontal pagingEnabled>
        {slike.map((slika, i) => {
          return (
            <View key={i}>
              <Image
                source={{uri: slika}}
                style={{width, height, resizeMode: 'contain'}}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default PrikaziSveOznaceneSlike;

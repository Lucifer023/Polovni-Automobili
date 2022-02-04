import React, {useRef, useEffect} from 'react';
import {View, Image, ScrollView, Dimensions} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

const {width} = Dimensions.get('window');
const height = width * 0.6;

const PrikaziSlikeOglasa = ({slike}) => {
  const ref = useRef(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    ref.current.scrollTo({x: 0, y: 0, animated: true});
  }, [isFocused]);

  return (
    <View style={{width, height}}>
      <ScrollView ref={ref} pagingEnabled horizontal style={{width, height}}>
        {slike.map((slika, index) => {
          return (
            <View key={index}>
              <Image
                style={{width, height, resizeMode: 'cover'}}
                source={{uri: slika}}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default PrikaziSlikeOglasa;

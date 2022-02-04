import React from 'react';
import {View, Image, ScrollView, StyleSheet} from 'react-native';

const PrikaziSlike = ({slike}) => {
  return (
    <View>
      <ScrollView
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        {slike.map((slika, i) => {
          return (
            <View key={i} style={[styles.ScrollView, styles.View]}>
              <Image
                source={{uri: slika}}
                style={[styles.ScrollView, styles.Image]}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  ScrollView: {
    flex: 0,
    width: 100,
    height: 160,
  },
  View: {
    margin: 3,
  },
  Image: {
    resizeMode: 'cover',
    margin: 5,
    borderRadius: 5,
  },
});

export default PrikaziSlike;

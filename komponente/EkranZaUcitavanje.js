import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

const EkranZaUcitavanje = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator color="#000" size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});

export default EkranZaUcitavanje;

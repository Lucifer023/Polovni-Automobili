import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {database} from '../database/database';
import {useIsFocused} from '@react-navigation/native';
import Oglas from './Oglas';
import {TextInput} from 'react-native-gesture-handler';

const Oglasi = ({navigation}) => {
  const [oglasi, setOglasi] = useState([]);
  const isFocused = useIsFocused();
  const [naslov, setNaslov] = useState('');

  useEffect(() => {
    dajOglase();
  }, [isFocused, naslov]);

  const dajOglase = async () => {
    const oglasiRef = await database.ref('oglasi').orderByValue().once('value');
    const data = oglasiRef.val();
    const values = Object.entries(data);
    if (naslov === '') {
      setOglasi(values);
    } else {
      const pretrazeniOglasi = values.filter(
        oglas =>
          oglas[1].naslov.toLowerCase().indexOf(naslov.trim().toLowerCase()) !==
          -1,
      );
      if (pretrazeniOglasi) {
        setOglasi(pretrazeniOglasi);
      }
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Pretraži oglase po naslovu"
          value={naslov}
          onChangeText={value => setNaslov(prev => ([...prev], value))}
        />
        <TouchableOpacity
          style={styles.closeButtonParent}
          onPress={() => setNaslov('')}>
          <Image
            style={styles.closeButton}
            source={require('../images/x-mark.png')}
          />
        </TouchableOpacity>
      </View>
      {oglasi.map(oglas => {
        return (
          <Oglas
            key={oglas[0]}
            {...{oglasID: oglas[0], oglas: oglas[1]}}
            navigation={navigation}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  input: {
    flex: 1,
    marginLeft: 10,
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 0,
    padding: 10,
    borderRadius: 5,
  },
  closeButton: {
    height: 25,
    width: 25,
  },
  closeButtonParent: {
    padding: 15,
  },
});

export default Oglasi;

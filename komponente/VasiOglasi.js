import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import {database} from '../database/database';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import Oglas from './Oglas';

const VasiOglasi = ({navigation}) => {
  const [oglasi, setOglasi] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    dajOglase();
  }, [isFocused]);

  const dajOglase = async () => {
    const oglasiRef = await database.ref('oglasi').once('value');
    const data = oglasiRef.val();
    const values = Object.entries(data);
    const korisnikUID = await AsyncStorage.getItem('uid');
    const oglasiKorisnika = values.filter(
      oglas => oglas[1].korisnikID === korisnikUID,
    );
    setOglasi(oglasiKorisnika);
  };

  const prikaziPoruku = oglasID => {
    Alert.alert(
      'Da li si siguran ?',
      'Da li si sigran da želiš obrisati oglas ?',
      [
        // Btn Da
        {
          text: 'Da',
          onPress: () => obrisiOglas(oglasID),
        },

        // Btn Ne
        {
          text: 'Ne',
        },
      ],
    );
  };

  const obrisiOglas = async oglasID => {
    // Brisanje oglasa
    await database
      .ref(`oglasi/${oglasID}`)
      .remove()
      .catch(() => alert('Došlo je do greške !'));

    // Uzimanje svih slika za jedan oglas i brisanje svih tih slika iz foldera za taj oglas koji zelimo da obrisemo
    const slikeRefs = await storage().ref(`/${oglasID}`).listAll();
    const urls = await Promise.all(
      slikeRefs.items.map(ref => ref.getDownloadURL()),
    );
    for (let i = 0; i < urls.length; i++) {
      await storage()
        .ref(`/${oglasID}`)
        .child(`slika${i}.jpg`)
        .delete()
        .catch(() => alert('Došlo je do greške !'));
    }

    alert('Uspešno obrisan oglas !');

    // prikazi preostale oglase
    dajOglase();
  };

  return (
    <ScrollView>
      {oglasi.map(oglas => {
        return (
          <View key={oglas[0]}>
            <Oglas
              key={oglas[0]}
              {...{oglasID: oglas[0], oglas: oglas[1]}}
              navigation={navigation}
            />

            <View style={styles.container}>
              <TouchableOpacity
                style={styles.deleteButtonParent}
                onPress={() => prikaziPoruku(oglas[0])}>
                <Image
                  style={styles.deleteButton}
                  source={require('../images/delete.png')}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Izmeni oglas', {
                    oglasID: oglas[0],
                    oglas: oglas[1],
                  })
                }>
                <Image
                  style={styles.updateButton}
                  source={require('../images/update.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#C1B2B6',
    position: 'absolute',
    marginVertical: 145,
  },
  deleteButtonParent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  deleteButton: {
    height: 45,
    width: 45,
  },
  updateButton: {
    height: 40,
    width: 40,
  },
});

export default VasiOglasi;

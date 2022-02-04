import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {database} from '../database/database';
import {useIsFocused} from '@react-navigation/native';
import storage from '@react-native-firebase/storage';

const Oglas = ({oglasID, oglas, navigation}) => {
  const [marka, setMarka] = useState('');
  const [gorivo, setGorivo] = useState([]);
  const [karoserija, setKaroserija] = useState([]);
  const [model, setModel] = useState([]);
  const [slike, setSlike] = useState([]);
  const [korisnik, setKorisnik] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    dajMarku();
    dajModel();
    dajKaroseriju();
    dajGorivo();
    dajSlike();
    dajKorisnike();

    return () => {
      setMarka('');
      setGorivo([]);
      setKaroserija([]);
      setModel([]);
      setSlike([]);
    };
  }, [isFocused]);

  const dajMarku = async () => {
    const marka = await database.ref(`marke/${oglas.markaID}`).once('value');
    const data = marka.val();
    setMarka(data);
  };

  const dajModel = async () => {
    const model = await database
      .ref(`modeli/${oglas.modelID}`)
      .orderByValue()
      .once('value');
    const data = model.val();
    setModel(data);
  };

  const dajKaroseriju = async () => {
    const karoserija = await database
      .ref(`karoserije/${oglas.karoserijaID}`)
      .once('value');
    const data = karoserija.val();
    setKaroserija(data);
  };

  const dajGorivo = async () => {
    const gorivo = await database.ref(`goriva/${oglas.gorivoID}`).once('value');
    const data = gorivo.val();
    setGorivo(data);
  };

  const dajSlike = async () => {
    const slikeRefs = await storage().ref().child(`/${oglasID}`).listAll();
    const urls = await Promise.all(
      slikeRefs.items.map(ref => ref.getDownloadURL()),
    );
    setSlike(urls);
  };

  const dajKorisnike = async () => {
    const korisniciRefs = await database
      .ref(`korisnici/${oglas.korisnikID}`)
      .once('value');
    const data = korisniciRefs.val();
    setKorisnik(data);
  };

  const priceFormatter = new Intl.NumberFormat('sr-SR', {
    style: 'currency',
    currency: 'EUR',
  });

  return (
    <ScrollView>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() =>
          navigation.navigate('Oglas detalji', {
            korisnik: korisnik,
            slike: slike,
            oglas: oglas,
            marka: marka,
            model: model,
            karoserija: karoserija,
            gorivo: gorivo,
          })
        }>
        <View key={oglasID} style={styles.container}>
          <View style={styles.containerHeader}>
            <View style={styles.containerHeading}>
              <Text style={styles.containerHeadingText}>{oglas.naslov}</Text>
            </View>
            <View style={styles.containerHeadingPrice}>
              <Text style={styles.price}>
                {priceFormatter.format(oglas.cena)}
              </Text>
            </View>
          </View>
          <View style={styles.containerBody}>
            <View style={styles.containerLeft}>
              <Image style={styles.image} source={{uri: slike[0]}} />
            </View>
            <View style={styles.containerCenter}>
              <Text style={styles.text}>
                {marka} {model.naziv}
              </Text>
              <Text style={styles.text}>{oglas.kubikaza} cm3</Text>
              <Text style={styles.text}>{oglas.konjskaSnaga} KS</Text>
            </View>
            <View style={styles.containerRight}>
              <Text style={styles.text}>{oglas.godiste} god.</Text>
              <Text style={styles.text}>{karoserija}</Text>
              <Text style={styles.text}>{gorivo}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#C1B2B6',
    borderRadius: 5,
    marginBottom: 40,
  },
  containerHeader: {
    flex: 1,
    flexDirection: 'row',
  },
  containerHeading: {
    flex: 1,
    justifyContent: 'flex-start',
    marginLeft: 4,
  },
  containerHeadingText: {
    paddingLeft: 3,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 3,
  },
  containerHeadingPrice: {
    backgroundColor: '#f1a41a',
    marginRight: 5,
    padding: 3,
    borderRadius: 5,
  },
  price: {
    color: '#ffffff',
  },
  containerBody: {
    flex: 1,
    flexDirection: 'row',
  },
  image: {
    marginLeft: 3,
    width: 110,
    height: 110,
    borderRadius: 7,
  },
  containerLeft: {
    justifyContent: 'flex-start',
    marginLeft: 3,
  },
  containerCenter: {
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
  },
  containerRight: {
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
  },
  text: {
    fontWeight: '400',
    color: '#000000',
  },
});

export default Oglas;

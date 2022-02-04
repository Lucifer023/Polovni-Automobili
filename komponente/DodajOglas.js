import React, {useState, useEffect} from 'react';
import {
  Button,
  StyleSheet,
  View,
  ToastAndroid,
  Image,
  TouchableOpacity,
} from 'react-native';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {Picker} from '@react-native-picker/picker';
import {database} from '../database/database';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import PrikaziSlike from '../pomocneKomponente/PrikaziSlike';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DodajOglas = ({navigation}) => {
  const [state, setState] = useState({
    naslov: '',
    opis: '',
    cena: '',
    godiste: '',
    kubikaza: '',
    konjskaSnaga: '',
    gorivoID: '',
    karoserijaID: '',
    markaID: '',
    modelID: '',
    korisnikID: '',
  });
  const [marke, setMarke] = useState([]);
  const [goriva, setGoriva] = useState([]);
  const [karoserije, setKaroserije] = useState([]);
  const [modeli, setModeli] = useState([]);
  const [slike, setSlike] = useState([]);
  const [slikeCopy, setSlikeCopy] = useState([]);

  const initialState = {
    naslov: '',
    opis: '',
    cena: '',
    godiste: '',
    kubikaza: '',
    konjskaSnaga: '',
    gorivoID: '',
    karoserijaID: '',
    markaID: '',
    modelID: '',
    korisnikID: '',
  };

  useEffect(() => {
    dajMarke();
    dajGoriva();
    dajKaroserije();
    dajModele();
  }, []);

  const dajMarke = async () => {
    const marke = await database.ref('marke').once('value');
    const data = marke.val();
    const values = Object.entries(data);
    setMarke(values.sort((a, b) => (a[1] > b[1] ? 1 : -1)));
  };

  const dajGoriva = async () => {
    const goriva = await database.ref('goriva').once('value');
    const data = goriva.val();
    const values = Object.entries(data);
    setGoriva(values.sort((a, b) => (a[1] > b[1] ? 1 : -1)));
  };

  const dajKaroserije = async () => {
    const karoserije = await database.ref('karoserije').once('value');
    const data = karoserije.val();
    const values = Object.entries(data);
    setKaroserije(values.sort((a, b) => (a[1] > b[1] ? 1 : -1)));
  };

  const dajModele = async () => {
    const modeli = await database.ref('modeli').orderByValue().once('value');
    const data = modeli.val();
    const values = Object.entries(data);
    setModeli(values.sort((a, b) => (a[1].naziv > b[1].naziv ? 1 : -1)));
  };

  const errorToast = () => {
    ToastAndroid.showWithGravity(
      'Morate popuniti sva polja !',
      ToastAndroid.LONG,
      ToastAndroid.TOP,
    );
  };

  const clearState = () => {
    setState(initialState);
    setSlike([]);
    setSlikeCopy([]);
  };

  const dodajOglas = async () => {
    const oglasRef = database.ref('oglasi').push();

    const promises = [];

    for (let i = 0; i < slike.length; i++) {
      const imgRef = storage().ref(`${oglasRef.key}/slika${i}.jpg`);
      promises[i] = imgRef
        .putFile(slike[i])
        .catch(e => alert('Došlo je do greške prilikom dodavanja slika !'));
    }

    Promise.all([
      oglasRef.set({
        naslov: state.naslov,
        opis: state.opis,
        cena: +state.cena.replace(/[^0-9]/g, ''),
        godiste: +state.godiste.replace(/[^0-9]/g, ''),
        kubikaza: +state.kubikaza.replace(/[^0-9]/g, ''),
        konjskaSnaga: +state.konjskaSnaga.replace(/[^0-9]/g, ''),
        datumOglasa: moment().format(),
        gorivoID: state.gorivoID,
        karoserijaID: state.karoserijaID,
        markaID: state.markaID,
        modelID: state.modelID,
        korisnikID: await AsyncStorage.getItem('uid'),
      }),
      ...promises,
    ])
      .then(() =>
        ToastAndroid.showWithGravity(
          'Sačekajte da se oglas doda...',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
        ),
      )
      .then(() =>
        ToastAndroid.showWithGravity(
          'Uspešno ste dodali oglas !',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
        ),
      )
      .then(() => clearState())
      .catch(() => alert('Došlo je do greške prilikom dodavanja oglasa !'));
  };

  const handleSubmit = () => {
    if (
      state.naslov &&
      state.opis &&
      state.cena &&
      state.gorivoID &&
      state.karoserijaID &&
      state.markaID &&
      state.modelID
    ) {
      dodajOglas();
    } else {
      errorToast();
    }
  };

  const dodajSlike = async () => {
    const sveSlike = await ImagePicker.openPicker({
      multiple: true,
    }).catch(() =>
      ToastAndroid.showWithGravity(
        'Niste odabrali ni jednu sliku !',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      ),
    );

    const brojSlika = sveSlike?.length;

    if (brojSlika <= 10) {
      for (let i = 0; i < brojSlika; i++) {
        setSlike(prev => [...prev, sveSlike[i].path]);
        setSlikeCopy(prev => [...prev, sveSlike[i].path]);
      }
    } else if (brojSlika > 10) {
      ToastAndroid.showWithGravity(
        'Možete odabrati maksimalno 10 slika !',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
    }
  };

  return (
    <ScrollView>
      <View>
        <TextInput
          style={styles.input}
          value={state.naslov}
          placeholder="Naslov"
          onChangeText={value => setState(prev => ({...prev, naslov: value}))}
        />
        <TextInput
          style={[styles.input]}
          value={state.cena}
          placeholder="Cena"
          keyboardType="phone-pad"
          onChangeText={value => setState(prev => ({...prev, cena: value}))}
        />
        <TextInput
          style={[styles.input]}
          value={state.godiste}
          placeholder="Godište"
          keyboardType="phone-pad"
          onChangeText={value => setState(prev => ({...prev, godiste: value}))}
        />
        <TextInput
          style={[styles.input]}
          value={state.kubikaza}
          placeholder="Kubikaža"
          keyboardType="phone-pad"
          onChangeText={value => setState(prev => ({...prev, kubikaza: value}))}
        />
        <TextInput
          style={[styles.input]}
          value={state.konjskaSnaga}
          placeholder="Konjska snaga"
          keyboardType="phone-pad"
          onChangeText={value =>
            setState(prev => ({...prev, konjskaSnaga: value}))
          }
        />
        <TextInput
          style={[styles.input, styles.setAlignTextTop]}
          value={state.opis}
          multiline={true}
          numberOfLines={5}
          placeholder="Opis"
          onChangeText={value => setState(prev => ({...prev, opis: value}))}
        />

        <View style={styles.btn}>
          <Button title="Dodaj slike" onPress={() => dodajSlike()} />
        </View>

        {slike?.length !== 0 && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              navigation.navigate('Slike oglasa', {slike: slikeCopy})
            }>
            <View>
              <PrikaziSlike slike={slike?.slice(0, 6)} />
            </View>
          </TouchableOpacity>
        )}

        {slikeCopy?.length > 6 && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Slike oglasa', {slike: slikeCopy})
            }>
            <View style={styles.container}>
              <Image
                style={styles.dots}
                source={require('../images/dots.png')}
              />
            </View>
          </TouchableOpacity>
        )}

        <Picker
          selectedValue={state.markaID}
          onValueChange={itemValue =>
            setState(prev => ({...prev, markaID: itemValue}))
          }>
          <Picker.Item value="" label="Marka" enabled={false} />
          {marke.map(marka => {
            return (
              <Picker.Item
                key={marka[0]}
                label={marka[1]}
                value={marka[0]}></Picker.Item>
            );
          })}
        </Picker>

        <Picker
          selectedValue={state.modelID}
          enabled={state.markaID === '' ? false : true}
          onValueChange={itemValue =>
            setState(prev => ({...prev, modelID: itemValue}))
          }>
          <Picker.Item value="" label="Svi modeli" enabled={false} />
          {modeli.map(model => {
            return (
              model[1].markaID === state.markaID && (
                <Picker.Item
                  key={model[0]}
                  label={model[1].naziv}
                  value={model[0]}></Picker.Item>
              )
            );
          })}
        </Picker>

        <Picker
          selectedValue={state.karoserijaID}
          onValueChange={itemValue =>
            setState(prev => ({...prev, karoserijaID: itemValue}))
          }>
          <Picker.Item value="" label="Karoserija" enabled={false} />
          {karoserije.map(karoserija => {
            return (
              <Picker.Item
                key={karoserija[0]}
                label={karoserija[1]}
                value={karoserija[0]}></Picker.Item>
            );
          })}
        </Picker>

        <Picker
          selectedValue={state.gorivoID}
          onValueChange={itemValue =>
            setState(prev => ({...prev, gorivoID: itemValue}))
          }>
          <Picker.Item value="" label="Vrsta goriva" enabled={false} />
          {goriva.map(gorivo => {
            return (
              <Picker.Item
                key={gorivo[0]}
                label={gorivo[1]}
                value={gorivo[0]}></Picker.Item>
            );
          })}
        </Picker>

        <View style={styles.btn}>
          <Button title="Dodaj oglas" onPress={() => handleSubmit()} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  setAlignTextTop: {
    textAlignVertical: 'top',
  },
  dots: {
    width: 40,
    height: 40,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    margin: 12,
  },
});

export default DodajOglas;

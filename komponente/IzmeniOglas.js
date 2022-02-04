import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import PrikaziSlike from '../pomocneKomponente/PrikaziSlike';
import {database} from '../database/database';
import moment from 'moment';

const IzmeniOglas = ({route, navigation}) => {
  const {oglasID, oglas} = route.params;
  const [state, setState] = useState({
    naslov: oglas.naslov,
    opis: oglas.opis,
    cena: oglas.cena.toString(),
    godiste: oglas.godiste.toString(),
    kubikaza: oglas.kubikaza.toString(),
    konjskaSnaga: oglas.konjskaSnaga.toString(),
    markaID: oglas.markaID,
    modelID: oglas.modelID,
    karoserijaID: oglas.karoserijaID,
    gorivoID: oglas.gorivoID,
  });
  const [marke, setMarke] = useState([]);
  const [modeli, setModeli] = useState([]);
  const [karoserije, setKaroserije] = useState([]);
  const [goriva, setGoriva] = useState([]);
  const [slike, setSlike] = useState([]);
  const [slikeCopy, setSlikeCopy] = useState([]);
  const [ubacujeSlike, setUbacujeSlike] = useState(false);

  useEffect(() => {
    dajMarke();
    dajGoriva();
    dajKaroserije();
    dajModele();
    dajSlike();
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

  const dajSlike = async () => {
    const slikeRefs = await storage().ref(`/${oglasID}`).listAll();
    const urls = await Promise.all(
      slikeRefs.items.map(ref => ref.getDownloadURL()),
    );
    setSlike(urls);
    setSlikeCopy(urls);
  };

  const prikaziSlike = async () => {
    setUbacujeSlike(true);
    setSlike([]);
    setSlikeCopy([]);
    const sveSlike = await ImagePicker.openPicker({
      multiple: true,
    }).catch(e => console.log(e.message));

    const brojSlika = sveSlike.length;

    if (brojSlika <= 10) {
      const brojSlika = sveSlike.length;
      for (let i = 0; i < brojSlika; i++) {
        setSlike(prev => [...prev, sveSlike[i].path]);
        setSlikeCopy(prev => [...prev, sveSlike[i].path]);
      }
    } else {
      ToastAndroid.showWithGravity(
        'Možete odabrati maksimalno 10 slika !',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
    }
  };

  const izmeniOglas = async () => {
    const oglasRef = database.ref(`oglasi/${oglasID}`);
    const promises = [];

    if (ubacujeSlike) {
      setUbacujeSlike(false);
      // Uzimanje svih slika za jedan oglas i brisanje svih tih slika iz foldera za taj oglas,
      // da bi dodali nove slike koje je odabrao korisnik
      const slikeRefs = await storage().ref(`/${oglasRef.key}`).listAll();
      const urls = await Promise.all(
        slikeRefs.items.map(ref => ref.getDownloadURL()),
      );
      for (let i = 0; i < urls.length; i++) {
        await storage()
          .ref(`/${oglasRef.key}`)
          .child(`slika${i}.jpg`)
          .delete()
          .catch(() => alert('Došlo je do greške !'));
      }

      // Ubacivanje novih slika u storage
      for (let i = 0; i < slike.length; i++) {
        const imgRef = storage().ref(`${oglasRef.key}/slika${i}.jpg`);
        promises[i] = imgRef
          .putFile(slike[i])
          .catch(() => alert('Došlo je do greške prilikom dodavanja slika !'));
      }
    }

    Promise.all([
      oglasRef.update({
        naslov: state.naslov,
        opis: state.opis,
        cena: +state.cena.replace(/[^0-9]/g, ''),
        godiste: +state.godiste.replace(/[^0-9]/g, ''),
        kubikaza: +state.kubikaza.replace(/[^0-9]/g, ''),
        konjskaSnaga: +state.konjskaSnaga.replace(/[^0-9]/g, ''),
        datumOglasa: moment().format(),
        markaID: state.markaID,
        modelID: state.modelID,
        karoserijaID: state.karoserijaID,
        gorivoID: state.gorivoID,
      }),
      ...promises,
    ])
      .then(() =>
        ToastAndroid.showWithGravity(
          'Sačekajte da se oglas ažurira...',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
        ),
      )
      .then(() =>
        ToastAndroid.showWithGravity(
          'Uspešno ste ažurirali oglas !',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
        ),
      )
      .catch(() => alert('Došlo je do greške prilikom ažuriranja oglasa !'));
  };
  return (
    <ScrollView>
      <View>
        <TextInput
          style={styles.input}
          placeholder="Naslov"
          defaultValue={state.naslov}
          onChangeText={value => setState(prev => ({...prev, naslov: value}))}
        />
        <TextInput
          style={styles.input}
          placeholder="Cena"
          keyboardType='phone-pad'
          defaultValue={state.cena}
          onChangeText={value => setState(prev => ({...prev, cena: value}))}
        />
        <TextInput
          style={styles.input}
          placeholder="Godište"
          keyboardType='phone-pad'
          defaultValue={state.godiste}
          onChangeText={value => setState(prev => ({...prev, godiste: value}))}
        />
        <TextInput
          style={styles.input}
          placeholder="Kubikaža"
          keyboardType='phone-pad'
          defaultValue={state.kubikaza}
          onChangeText={value => setState(prev => ({...prev, kubikaza: value}))}
        />
        <TextInput
          style={styles.input}
          placeholder="Konjska snaga"
          keyboardType='phone-pad'
          defaultValue={state.konjskaSnaga}
          onChangeText={value =>
            setState(prev => ({...prev, konjskaSnaga: value}))
          }
        />
        <TextInput
          style={[styles.input, styles.setAlignTextTop]}
          placeholder="Opis"
          multiline={true}
          numberOfLines={5}
          defaultValue={state.opis}
          onChangeText={value => setState(prev => ({...prev, opis: value}))}
        />
      </View>

      <View style={styles.btn}>
        <Button title="Izmeni slike" onPress={() => prikaziSlike()} />
      </View>

      {slike.length !== 0 && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            navigation.navigate('Slike oglasa koji se menja', {
              slike: slikeCopy,
            })
          }>
          <View>
            <PrikaziSlike slike={slike.slice(0, 6)} />
          </View>
        </TouchableOpacity>
      )}

      {slikeCopy.length > 6 && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Slike oglasa koji se menja', {
              slike: slikeCopy,
            })
          }>
          <View style={styles.container}>
            <Image style={styles.dots} source={require('../images/dots.png')} />
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
        onValueChange={itemValue =>
          setState(prev => ({...prev, modelID: itemValue}))
        }>
        <Picker.Item value="" label="Svi modeli" />
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
        <Button title="Izmeni oglas" onPress={() => izmeniOglas()} />
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
    width: 500,
    height: 500,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    margin: 12,
  },
});

export default IzmeniOglas;

import React, {useState, useEffect} from 'react';
import {Button, ScrollView, View, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {database} from '../database/database';
import {TextInput} from 'react-native-gesture-handler';
import Oglas from './Oglas';

const PretragaOglasa = ({navigation}) => {
  const [state, setState] = useState({
    cenaMinimalna: '',
    cenaMaksimalna: '',
    gorivoID: '',
    karoserijaID: '',
    markaID: '',
    modelID: '',
  });
  const [marke, setMarke] = useState([]);
  const [goriva, setGoriva] = useState([]);
  const [karoserije, setKaroserije] = useState([]);
  const [modeli, setModeli] = useState([]);
  const [oglasi, setOglasi] = useState([]);
  const [showFilteredData, setShowFilteredData] = useState(false);

  useEffect(() => {
    dajOglase();
    dajMarke();
    dajGoriva();
    dajKaroserije();
    dajModele();

    // prilikom izlaska iz komponente, ceo state se resetuje
    const unsubscribe = navigation.addListener('focus', () => {
      setState(initialState);
      setShowFilteredData(false);
    });
    return unsubscribe;
  }, []);

  const clearState = () => {
    setState(initialState);
    setShowFilteredData(false);
    dajOglase();
  };

  const dajOglase = async () => {
    const oglasiRef = await database.ref('oglasi').once('value');
    const data = oglasiRef.val();
    const values = Object.entries(data);
    setOglasi(values);
  };

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

  const filtriraj = () => {
    if (state.cenaMinimalna) {
      const parsedIntMin = parseInt(state.cenaMinimalna);
      const cenaVecaOdMinimuma = oglasi.filter(
        oglas => oglas[1].cena >= parsedIntMin,
      );
      setOglasi(prev => ([...prev], cenaVecaOdMinimuma));
    }

    if (state.cenaMaksimalna) {
      const parsedIntMax = parseInt(state.cenaMaksimalna);
      const cenaManjaodMaksimuma = oglasi.filter(
        oglas => oglas[1].cena <= parsedIntMax,
      );
      setOglasi(prev => ([...prev], cenaManjaodMaksimuma));
    }

    if (state.markaID) {
      const data = oglasi.filter(oglas => oglas[1].markaID === state.markaID);
      setOglasi(prev => ([...prev], data));
    }

    if (state.modelID) {
      const data1 = oglasi.filter(oglas => oglas[1].modelID === state.modelID);
      setOglasi(prev => ([...prev], data1));
    }

    if (state.karoserijaID) {
      const data2 = oglasi.filter(
        oglas => oglas[1].karoserijaID === state.karoserijaID,
      );
      setOglasi(prev => ([...prev], data2));
    }

    if (state.gorivoID) {
      const data3 = oglasi.filter(
        oglas => oglas[1].gorivoID === state.gorivoID,
      );
      setOglasi(prev => ([...prev], data3));
    }

    setShowFilteredData(true);
  };

  const initialState = {
    cenaMinimalna: '',
    cenaMaksimalna: '',
    gorivoID: '',
    karoserijaID: '',
    markaID: '',
    modelID: '',
  };

  return (
    <ScrollView>
      <View style={styles.btn}>
        <Button title="Resetuj filter" onPress={() => clearState()} />
      </View>

      <View style={styles.container}>
        <View style={styles.levaStrana}>
          <TextInput
            style={styles.input}
            defaultValue={state.cenaMinimalna}
            placeholder="Cena od (€)"
            onChangeText={value =>
              setState(prev => ({...prev, cenaMinimalna: value}))
            }
          />
        </View>
        <View style={styles.desnaStrana}>
          <TextInput
            style={styles.input}
            defaultValue={state.cenaMaksimalna}
            placeholder="Cena do (€)"
            onChangeText={value =>
              setState(prev => ({...prev, cenaMaksimalna: value}))
            }
          />
        </View>
      </View>

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
        <Button title="Pretraži" onPress={() => filtriraj()} />
      </View>

      {showFilteredData &&
        oglasi.map(oglas => {
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
  input: {
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  btn: {
    margin: 12,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  levaStrana: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  desnaStrana: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default PretragaOglasa;

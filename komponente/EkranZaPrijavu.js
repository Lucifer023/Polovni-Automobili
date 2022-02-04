import React, {useState} from 'react';
import {TextInput, Button, StyleSheet, Text} from 'react-native';
import {signIn, signUp} from '../utils/FirebaseUtil';
import {database} from '../database/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView} from 'react-native-gesture-handler';

const EkranZaPrijavu = () => {
  const [create, setCreate] = useState(false);
  const [korisnik, setKorisnik] = useState({
    email: '',
    lozinka: '',
    imePrezime: '',
    grad: '',
    adresa: '',
    telefon: '',
    ID: '',
  });

  const prijaviSe = () => {
    if (korisnik.email && korisnik.lozinka) {
      signIn(korisnik.email.trim(), korisnik.lozinka.trim())
        .then(user => AsyncStorage.setItem('uid', user.user.uid))
        .catch(e => {
          alert('Pogrešan email/password !');
        });
    } else {
      alert('Morate popuniti sva polja !');
    }
  };

  const registrujSe = async () => {
    if (
      korisnik.email &&
      korisnik.lozinka &&
      korisnik.imePrezime &&
      korisnik.grad &&
      korisnik.adresa &&
      korisnik.telefon
    ) {
      // Registracija
      await signUp(korisnik.email.trim(), korisnik.lozinka)
        .then(user =>
          AsyncStorage.setItem('uid', user.user.uid).catch(e =>
            console.log(e.message),
          ),
        )
        .then(() => alert('Uspešno ste se registrovali !'))
        .catch(e => {
          if (e.code === 'auth/email-already-in-use')
            alert('Nalog sa datom email adresom već postoji !');
          else if (e.code === 'auth/invalid-email')
            alert('Email adresa nije važeća !');
          else if (e.code === 'auth/weak-password')
            alert('Lozinka nije dovoljno jaka !');
          else return;
        });

      // const user = firebase.auth().currentUser;
      // console.log(user);
      // Dodavanje korisnika u bazu
      const uid = await AsyncStorage.getItem('uid').catch(e =>
        console.log(e.message),
      );
      const korisniciRef = database.ref(`korisnici/${uid}`);
      korisniciRef
        .set({
          email: korisnik.email.trim(),
          imePrezime: korisnik.imePrezime.trim(),
          grad: korisnik.grad.trim(),
          adresa: korisnik.adresa.trim(),
          telefon: korisnik.telefon.trim(),
          ID: await AsyncStorage.getItem('uid'),
        })
        .catch(() => {
          alert('Došlo je do greške !');
        });
    } else {
      alert('Morate popuniti sva polja !');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.mainContainer}>
      {create ? (
        <ScrollView contentContainerStyle={styles.container}>
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={value =>
              setKorisnik(prev => ({...prev, email: value}))
            }
          />
          <TextInput
            style={styles.textInput}
            placeholder="Lozinka"
            secureTextEntry={true}
            onChangeText={value =>
              setKorisnik(prev => ({...prev, lozinka: value}))
            }
          />
          <TextInput
            style={styles.textInput}
            placeholder="Ime i prezime"
            onChangeText={value =>
              setKorisnik(prev => ({...prev, imePrezime: value}))
            }
          />
          <TextInput
            style={styles.textInput}
            placeholder="Grad"
            onChangeText={value =>
              setKorisnik(prev => ({...prev, grad: value}))
            }
          />
          <TextInput
            style={styles.textInput}
            placeholder="Ulica i broj"
            onChangeText={value =>
              setKorisnik(prev => ({...prev, adresa: value}))
            }
          />
          <TextInput
            style={styles.textInput}
            placeholder="Broj telefona"
            keyboardType="phone-pad"
            onChangeText={value =>
              setKorisnik(prev => ({...prev, telefon: value}))
            }
          />
          <Button title="Kreiraj nalog" onPress={() => registrujSe()} />
          <Text style={styles.text} onPress={() => setCreate(false)}>
            Prijavi se
          </Text>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={value =>
              setKorisnik(prev => ({...prev, email: value}))
            }
          />
          <TextInput
            style={styles.textInput}
            placeholder="Lozinka"
            secureTextEntry={true}
            onChangeText={value =>
              setKorisnik(prev => ({...prev, lozinka: value}))
            }
          />
          <Button title="Prijavite se" onPress={() => prijaviSe()} />
          <Text style={styles.text} onPress={() => setCreate(true)}>
            Napravite nalog
          </Text>
        </ScrollView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#FFEEE6',
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#FFEEE6',
    justifyContent: 'center',
    padding: 20,
    alignContent: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'grey',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  text: {
    color: 'blue',
    marginTop: 20,
  },
});

export default EkranZaPrijavu;

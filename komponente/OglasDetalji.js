import React from 'react';
import {Text, View, ScrollView, StyleSheet} from 'react-native';
import PrikaziSlikeOglasa from '../pomocneKomponente/PrikaziSlikeOglasa';

const OglasDetalji = ({route}) => {
  const {oglas, marka, model, karoserija, gorivo, slike, korisnik} =
    route.params;

  const priceFormatter = new Intl.NumberFormat('sr-SR', {
    style: 'currency',
    currency: 'EUR',
  });
  return (
    <ScrollView style={styles.container}>
      <PrikaziSlikeOglasa slike={slike} />

      <View style={styles.containerHeader}>
        <Text style={styles.containerHeaderText}>{oglas.naslov}</Text>
      </View>

      <View style={styles.containerHeader2}>
        <Text style={styles.containerHeaderPrice}>
          Cena: {priceFormatter.format(oglas.cena)}
        </Text>
      </View>

      <View style={styles.containerBody}>
        <View style={styles.containerBodyHeader}>
          <Text style={styles.containerBodyHeaderText}>Opšte informacije</Text>
        </View>

        <View style={styles.containerBodyElements}>
          <View style={styles.containerBodyElementsHeadings}>
            <Text style={styles.containerBodyElementsHeadingsText}>Marka</Text>
            <Text style={styles.containerBodyElementsHeadingsText}>Model</Text>
            <Text style={styles.containerBodyElementsHeadingsText}>
              Godina proizvodnje
            </Text>
            <Text style={styles.containerBodyElementsHeadingsText}>
              Karoserija
            </Text>
            <Text style={styles.containerBodyElementsHeadingsText}>Gorivo</Text>
          </View>

          <View style={styles.containerBodyElementsData}>
            <Text style={styles.containerBodyElementsDataText}>{marka}</Text>
            <Text style={styles.containerBodyElementsDataText}>
              {model.naziv}
            </Text>
            <Text style={styles.containerBodyElementsDataText}>
              {oglas.godiste}
            </Text>
            <Text style={styles.containerBodyElementsDataText}>
              {karoserija}
            </Text>
            <Text style={styles.containerBodyElementsDataText}>{gorivo}</Text>
          </View>
        </View>

        <View style={styles.containerBodyHeader}>
          <Text style={styles.containerBodyHeaderText}>
            Dodatne informacije
          </Text>
        </View>

        <View style={styles.containerBodyElements}>
          <View style={styles.containerBodyElementsHeadings}>
            <Text style={styles.containerBodyElementsHeadingsText}>
              Kubikaža (cm3)
            </Text>
            <Text style={styles.containerBodyElementsHeadingsText}>
              Snaga (KS)
            </Text>
          </View>

          <View style={styles.containerBodyElementsData}>
            <Text style={styles.containerBodyElementsDataText}>
              {oglas.kubikaza}
            </Text>
            <Text style={styles.containerBodyElementsDataText}>
              {oglas.konjskaSnaga}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.containerFooterHeader}>
        <Text style={styles.containerBodyHeaderText}>Kontakt podaci</Text>
      </View>

      <View style={styles.containerBodyElements}>
        <View style={styles.containerBodyElementsHeadings}>
          <Text style={styles.containerBodyElementsHeadingsText}>
            Ime i prezime
          </Text>
          <Text style={styles.containerBodyElementsHeadingsText}>Grad</Text>
          <Text style={styles.containerBodyElementsHeadingsText}>Adresa</Text>
          <Text style={styles.containerBodyElementsHeadingsText}>📱</Text>
        </View>

        <View style={styles.containerBodyElementsData}>
          <Text style={styles.containerBodyElementsDataText}>
            {korisnik.imePrezime}
          </Text>
          <Text style={styles.containerBodyElementsDataText}>
            {korisnik.grad}
          </Text>
          <Text style={styles.containerBodyElementsDataText}>
            {korisnik.adresa}
          </Text>
          <Text style={styles.containerBodyElementsDataText}>
            {korisnik.telefon}
          </Text>
        </View>
      </View>

      <View style={styles.containerFooterHeader}>
        <Text style={styles.containerBodyHeaderText}>Opis</Text>
      </View>

      <View style={styles.containerFooter}>
        <Text style={styles.containerBodyElementsHeadingsText}>
          {oglas.opis}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerHeader: {
    alignItems: 'center',
    marginTop: 5,
  },
  containerHeader2: {
    marginVertical: 10,
    marginHorizontal: 11,
    alignItems: 'stretch',
  },
  containerHeaderText: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#000000',
  },
  containerHeaderPrice: {
    backgroundColor: '#f1a41a',
    color: '#ffffff',
    padding: 10,
    textAlign: 'center',
    fontSize: 17,
    borderRadius: 5,
    fontWeight: '900',
    letterSpacing: 2,
  },
  containerBody: {},
  containerBodyHeader: {
    marginVertical: 10,
    marginHorizontal: 11,
    borderBottomColor: '#fce0ad',
    borderBottomWidth: 1,
  },
  containerBodyHeaderText: {
    color: '#f1a41a',
    letterSpacing: 2,
    fontSize: 17,
    fontWeight: '900',
  },
  containerBodyElements: {
    flexDirection: 'row',
  },
  containerBodyElementsHeadings: {
    flex: 1,
    marginLeft: 11,
  },
  containerBodyElementsHeadingsText: {
    fontWeight: '400',
    color: '#000000',
  },
  containerBodyElementsData: {
    flex: 1,
    margin: 11,
    alignItems: 'flex-end',
  },
  containerBodyElementsDataText: {
    fontWeight: 'bold',
    color: '#000000',
  },
  containerFooterHeader: {
    marginVertical: 10,
    marginHorizontal: 11,
    borderBottomColor: '#fce0ad',
    borderBottomWidth: 1,
  },
  containerFooter: {
    marginVertical: 10,
    marginHorizontal: 11,
  },
});

export default OglasDetalji;

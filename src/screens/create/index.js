import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Text, Divider } from "@rneui/themed";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";

import { keyExtractor, renderItem } from "../../utils";
import { useMyContext } from "../../../context";

import moment from "moment";
import "moment/locale/es";

const Index = ({ navigation }) => {
  const {
    listGanaderos,
    rutaActual,
    listRecoleccionesLOCAL,
    listConductores,
    listRutas,
  } = useMyContext();
  const [ganaderosByRuta, setGanaderosByRuta] = useState([]);
  const [loading, setLoading] = useState(true);
  moment.locale("es");
  const formattedDateTime = moment().format("dddd D [de] MMMM : HH:mm");

  useEffect(() => {
    setLoading(true);
    setGanaderosByRuta(
      listGanaderos?.filter(
        (gl) => parseInt(gl.ruta) === parseInt(rutaActual?.id)
      )
    );
    setLoading(false);
  }, [listGanaderos, rutaActual]);

  const [recolecciones, setRecolecciones] = useState([]);

  useEffect(() => {
    let newData = [];

    listRecoleccionesLOCAL?.forEach((item) => {
      let newItem = { ...item };

      newItem.conductor = listConductores.find(
        (c) => parseInt(c.id) === parseInt(item.conductor)
      )?.nombre;

      newItem.ganadero_documento = listGanaderos.find(
        (c) => parseInt(c.id) === parseInt(item.ganadero)
      )?.documento;
      newItem.ganadero = listGanaderos.find(
        (c) => parseInt(c.id) === parseInt(item.ganadero)
      )?.nombre;
      newItem.ganadero_id = listGanaderos.find(
        (c) => parseInt(c.id) === parseInt(item.ganadero)
      )?.id;
      newItem.ruta = listRutas.find(
        (r) => parseInt(r.id) === parseInt(item.ruta)
      )?.nombre;

      newItem.conductor_id = parseInt(item.conductor);
      newData.push(newItem);

      setRecolecciones((recolecciones) => [...recolecciones, ...newData]);
    });
  }, []);

  const existRecolet = (item) => {
    return !!recolecciones?.find(
      (r) => parseInt(r?.ganadero_id) === parseInt(item.id)
    );
  };

  const onPressItem = (item) => {
    const data = existRecolet(item)
      ? recolecciones?.find(
          (r) => parseInt(r?.ganadero_id) === parseInt(item.id)
        )
      : item;

    const destination = existRecolet(item) ? "Print" : "Form";
    navigation.navigate(destination, { propData: data });
  };

  const [ganaderosByRutaFilter, setGanaderosByRutaFilter] =
    useState(ganaderosByRuta);

  useEffect(() => {
    setGanaderosByRutaFilter(ganaderosByRuta);
  }, [ganaderosByRuta]);

  const search = (item) => {
    const newData = ganaderosByRuta?.filter((gl) =>
      gl.nombre.includes(item.toUpperCase())
    );

    setGanaderosByRutaFilter(newData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.info_navigation}>
        <View style={styles.info_main}>
          <View style={styles.info}>
            <Icon name="local-shipping" color="#c90000" />
            <Text
              h3
              style={styles.info_ruta}
            >{`Ruta: ${rutaActual?.nombre}`}</Text>
          </View>
          <Text h5 style={styles.date}>
            {formattedDateTime}
          </Text>
        </View>
        <Divider />
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#c90000" />
        </View>
      ) : ganaderosByRuta?.length ? (
        <>
          <Text h4>Seleccione ganadero</Text>
          <View>
            <TextInput
              style={styles.input}
              onChangeText={(e) => search(e)}
              placeholder="Buscar..."
            />
          </View>
          <View style={styles.list}>
            <FlatList
              keyExtractor={keyExtractor}
              data={ganaderosByRutaFilter?.map((item) => {
                return {
                  ...item,
                  name: item.nombre,
                };
              })}
              renderItem={({ item }) =>
                renderItem({
                  item,
                  icon: existRecolet(item) && {
                    name: "check-circle",
                    color: "green",
                  },
                  onPress: () => {
                    onPressItem(item);
                  },
                })
              }
            />
          </View>
        </>
      ) : (
        <View style={styles.no_data}>
          <Icon name="error" color="#c90000" />
          <Text style={styles.no_data_text}>
            No hay ganaderos para esta ruta
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#e6e6e6",
    borderRadius: 20,
    padding: 5,
    paddingHorizontal: 20,
  },
  loading: { flex: 1, justifyContent: "center" },
  no_data_text: {
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
  },
  no_data: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    width: "100%",
  },
  list: { borderRadius: 10, padding: 10, backgroundColor: "white", flex: 1 },
  date: { textTransform: "capitalize" },
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
    height: "100%",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  info_navigation: {
    flexDirection: "row",
    alignItems: "center",
    /* marginRight: 50, */
  },
  info_main: {
    alignItems: "center",
    marginBottom: 5,
    width: "100%",
    flex: 1,
  },
  info_ruta: { textTransform: "capitalize" },
});

export default Index;

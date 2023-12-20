import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Text, Divider, Button, ListItem } from "@rneui/themed";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMyContext } from "../../../context";
import moment from "moment";

import { imprimirVoucherDia, sumarLitros } from "../../utils/voucherDia";
import { keyExtractor, renderItem } from "../../utils";

const Index = () => {
  const { listRecoleccionesLOCAL, listGanaderos, user } = useMyContext();
  const formattedDate2 = moment().format("DD/MM/YYYY");

  const uniqueList = listRecoleccionesLOCAL?.filter(
    (v, i, a) =>
      a.findIndex(
        (t) =>
          t.conductor === v.conductor &&
          t.fecha === v.fecha &&
          t.ganadero === v.ganadero &&
          t.litros === v.litros &&
          t.observaciones === v.observaciones &&
          t.ruta === v.ruta
      ) === i
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.info_navigation}>
        <View style={styles.info_main}>
          <View style={styles.info}>
            <Icon name="assignment" color="#c90000" />
            <Text h3>{`Recibo diario`}</Text>
          </View>
        </View>
        <Divider />
      </View>
      <View style={styles.main}>
        <View style={styles.info_pippo}>
          <Text style={styles.name}>Alimentos Pippo SAS</Text>
          <Text>Parque Agroindustrial Buenos Aires</Text>
          <Text>Guasca - Cundinamarca</Text>
          <Text>gerencia@alimentospippo.com</Text>
        </View>
        <Divider style={styles.dividier} />
        <View style={styles.info_pippo}>
          <Text>Recolectado por: {user?.nombre}</Text>
          <Text>Placas: {user?.placa}</Text>
          <Text>{`Fecha: ${formattedDate2}`}</Text>
        </View>
        <Divider style={styles.dividier} />
        <View style={styles.row}>
          <Text>Ganadero</Text>
          <Text>Litros</Text>
        </View>

        <FlatList
          keyExtractor={keyExtractor}
          data={uniqueList?.map((item) => {
            return {
              ...item,
              name: listGanaderos
                ?.find((lg) => parseInt(lg?.id) === parseInt(item?.ganadero))
                ?.nombre?.substring(0, 26),
              litros: item?.litros,
            };
          })}
          renderItem={({ item }) => (
            <ListItem>
              <ListItem.Content style={styles.row_map}>
                <Text style={styles.row_map_text}>{item?.name}</Text>
                <Text style={styles.row_map_text}>{item?.litros}</Text>
              </ListItem.Content>
            </ListItem>
          )}
        />

        <Divider style={styles.last_d} />

        <View style={styles.row}>
          <Text>TOTAL</Text>
          <Text>{sumarLitros(uniqueList)}</Text>
        </View>
      </View>

      <View style={styles.buttons_print}>
        <View style={styles.buttons_print_button}>
          <Button
            onPress={() => imprimirVoucherDia()}
            buttonStyle={styles.button}
            title={"Imprimir"}
            icon={<Icon name="print" color="white" />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  row_map_text: { fontSize: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },

  row_map: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: -20,
  },
  buttons_print_button: { flex: 1 },
  section: { marginBottom: 20 },
  sectionTitle: { alignItems: "center" },
  overlay_title: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
  },
  overlay_title_close: {
    marginLeft: "auto",
  },
  container_ble: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  bluetoothStatusContainer: {
    flexDirection: "row",
  },
  overlay_content: { padding: 20 },
  overlay_title_text: {
    width: "100%",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },

  overlay: { width: "80%" },
  buttons_print: { flexDirection: "row", alignItems: "center", gap: 20 },
  capitalize: { textTransform: "capitalize" },
  button: {
    backgroundColor: "#11B600",
    width: "100%",
    borderRadius: 20,
    gap: 5,
  },
  last_d: { marginVertical: 5 },
  condc: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  info_lts: {
    paddingVertical: 20,
    gap: 30,
  },
  item_imp_desc: {
    fontSize: 20,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  item_imp: { fontSize: 16, fontWeight: "bold" },
  item_desc: { fontWeight: "bold" },
  item: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  item_ganadero: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    flexWrap: "wrap",
  },
  dividier: { marginVertical: 1 },
  main: {
    backgroundColor: "#ffffff",
    flex: 1,
    padding: "10%",
    gap: 5,
    flexDirection: "column",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#aeb6bf",
  },
  recibo: {
    fontSize: 15,
    fontWeight: "bold",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  info_pippo: { alignItems: "center" },
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
    height: "100%",
  },
  info_main: {
    alignItems: "center",
    marginBottom: 5,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  info_navigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Index;

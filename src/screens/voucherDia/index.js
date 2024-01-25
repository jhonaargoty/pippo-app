import React, { useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Text, Divider, Button, ListItem } from "@rneui/themed";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMyContext } from "../../../context";
import moment from "moment";
import ThermalPrinterModule from "react-native-thermal-printer";
import { PermissionsAndroid } from "react-native";

import { sumarLitros } from "../../utils/voucherDia";
import { keyExtractor } from "../../utils";

const Index = () => {
  const { listRecoleccionesLOCAL, listGanaderos, user } = useMyContext();
  const formattedDate2 = moment().format("DD/MM/YYYY");

  const requestBluetoothScanPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        {
          title: "Permiso de Bluetooth",
          message:
            "Tu aplicación necesita acceso a Bluetooth " +
            "para imprimir recibos.",
          buttonNeutral: "Pregúntame luego",
          buttonNegative: "Cancelar",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Tienes permiso para usar Bluetooth Scan");
      } else {
        console.log("Permiso de Bluetooth Scan denegado");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestBluetoothConnectPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        {
          title: "Permiso de Bluetooth",
          message:
            "Tu aplicación necesita acceso a Bluetooth " +
            "para imprimir recibos.",
          buttonNeutral: "Pregúntame luego",
          buttonNegative: "Cancelar",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Tienes permiso para usar Bluetooth Connect");
      } else {
        console.log("Permiso de Bluetooth Connect denegado");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestBluetoothAdvertisePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        {
          title: "Permiso de Bluetooth",
          message:
            "Tu aplicación necesita acceso a Bluetooth " +
            "para imprimir recibos.",
          buttonNeutral: "Pregúntame luego",
          buttonNegative: "Cancelar",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Tienes permiso para usar Bluetooth Advertise");
      } else {
        console.log("Permiso de Bluetooth Advertise denegado");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestBluetoothScanPermission();
    requestBluetoothConnectPermission();
    requestBluetoothAdvertisePermission();
  }, []);

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

  function getNombreGanadero(detalle) {
    const ganadero = listGanaderos.find((g) => g.id === detalle?.ganadero);
    let nombre = ganadero?.nombre || "";
    if (nombre.length < 26) {
      nombre = nombre.padEnd(26, " ");
    } else {
      nombre = nombre.substring(0, 26);
    }
    return nombre;
  }

  function formatLitros(litros) {
    let litrosStr = String(litros);
    if (litrosStr.length < 4) {
      litrosStr = litrosStr.padStart(4, " ");
    }
    return litrosStr;
  }

  const imprimir = async () => {
    try {
      let receiptContent = "";
      receiptContent += "[C]      Alimentos Pippo SAS\n";
      receiptContent += "[C]     Parque Agroindustrial\n";
      receiptContent += "[C]          Buenos Aires\n";
      receiptContent += "[C]      Guasca - Cundinamarca\n";
      receiptContent += "[C]   gerencia@alimentospippo.com\n";
      receiptContent += "----------------------\n";
      receiptContent += `[C]Recolectado por: ${user?.nombre}\n`;
      receiptContent += `[C]Placas: ${user?.placa}\n\n`;
      receiptContent += `[C]Fecha: ${formattedDate2}\n`;
      receiptContent += "\n";
      receiptContent += "----------------------\n";
      receiptContent += `[C]Ganadero                  Litros\n`;
      for (const detalle of uniqueList || []) {
        receiptContent += `[C]${getNombreGanadero(detalle)} ${formatLitros(
          detalle?.litros
        )}\n`;
      }
      receiptContent += "----------------------\n";
      receiptContent += `[C]TOTAL: ${sumarLitros(uniqueList)} litros\n`;

      await ThermalPrinterModule.printBluetooth({
        payload: receiptContent,
        printerNbrCharactersPerLine: 1,
      });
    } catch (err) {
      //error handling
      console.log("-----", err.message);
    }
  };

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
            onPress={() => imprimir()}
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

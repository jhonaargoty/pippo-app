import React, { useEffect } from "react";
import { StyleSheet, View, BackHandler } from "react-native";
import { Text, Divider, Button } from "@rneui/themed";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMyContext } from "../../../context";
import ThermalPrinterModule from "react-native-thermal-printer";
import { PermissionsAndroid } from "react-native";
import { useState } from "react";

const Index = ({ navigation, route }) => {
  const { listConductores, listRecoleccionesLOCAL, listGanaderos } =
    useMyContext();
  const { propData } = route.params;

  console.log("propData", propData);

  const [filterRecolet, setFilterRecolet] = useState(null);

  useEffect(() => {
    const newData = listRecoleccionesLOCAL.find(
      (item) => parseInt(item.ganadero) === parseInt(propData?.id)
    );

    const ganaderoFilter = listGanaderos.find(
      (item) => parseInt(item.id) === parseInt(propData?.id)
    );

    const conductorFilter = listConductores.find(
      (item) => parseInt(item.id) === parseInt(newData?.conductor)
    );

    setFilterRecolet({
      ...newData,
      ...ganaderoFilter,
      ...conductorFilter,
      nombre_ganadero: ganaderoFilter?.nombre,
      nombre_conductor: conductorFilter?.nombre,
    });
  }, [propData]);

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

  const imprimir = async () => {
    try {
      let receiptContent = "";
      receiptContent += "[C]      Alimentos Pippo SAS\n";
      receiptContent += "[C]     Parque Agroindustrial\n";
      receiptContent += "[C]          Buenos Aires\n";
      receiptContent += "[C]      Guasca - Cundinamarca\n";
      receiptContent += "[C]   gerencia@alimentospippo.com\n";
      receiptContent += "[C]      Recibo de recoleccion\n";
      receiptContent += `[C]      Fecha: ${filterRecolet?.fecha}\n`;
      receiptContent += "----------------------\n";
      receiptContent += `[C]Ruta: ${filterRecolet?.ruta_nombre?.toUpperCase()}\n`;
      receiptContent += `[C]Ganadero:\n`;
      receiptContent += `[C]${filterRecolet?.nombre_ganadero}\n`;
      receiptContent += `[C]Documento: ${filterRecolet?.documento}\n`;
      receiptContent += "----------------------\n";
      receiptContent += `[C]Litros: ${filterRecolet?.litros || "-"}\n`;
      receiptContent += `[C]Observaciones:\n`;
      receiptContent += `[C]${filterRecolet?.observaciones || "Ninguna"}\n`;
      receiptContent += "----------------------\n";
      receiptContent += `[C]Recolectado por: ${filterRecolet?.nombre_conductor}\n`;
      receiptContent += `[C]Placas: ${filterRecolet?.placa}\n\n\n`;

      await ThermalPrinterModule.printBluetooth({
        payload: receiptContent,
        printerNbrCharactersPerLine: 1,
      });
    } catch (err) {
      //error handling
      console.log("-----", err.message);
    }
  };

  useEffect(() => {
    const backAction = () => {
      navigation.popToTop();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.info_navigation}>
        <View style={styles.info_main}>
          <View style={styles.info}>
            <Icon name="assignment" color="#c90000" />
            <Text h3>{`Recibo`}</Text>
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
        <View style={styles.info_pippo}>
          <Text style={styles.recibo}>Recibo de recolección</Text>
          <Text>{`Fecha: ${filterRecolet?.fecha}`}</Text>
        </View>
        <Divider style={styles.dividier} />

        <View style={styles.info_lts}>
          <View>
            <View style={styles.item}>
              <Text style={styles.item_desc}>Ruta:</Text>
              <Text style={styles.capitalize}>
                {filterRecolet?.ruta_nombre}
              </Text>
            </View>
            <View style={styles.item_ganadero}>
              <Text style={styles.item_desc}>Ganadero: </Text>
            </View>
            <View style={styles.item_ganadero}>
              <Text>{filterRecolet?.nombre_ganadero}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.item_desc}>Documento: </Text>
              <Text>{filterRecolet?.documento}</Text>
            </View>
          </View>
          <View>
            <View style={styles.item}>
              <Text style={styles.item_imp}>Litros</Text>
              <Text style={styles.item_imp_desc}>
                {filterRecolet?.litros || "-"}
              </Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.item_imp}>Observaciones</Text>
              <Text style={styles.item_imp_desc}>
                {filterRecolet?.observaciones || "Ninguna"}
              </Text>
            </View>
          </View>
        </View>

        <Divider style={styles.last_d} />
        <View style={styles.condc}>
          <View style={styles.item_cond}>
            <Text style={styles.item_desc}>Recolectado por:</Text>
            <Text>{filterRecolet?.nombre_conductor}</Text>
          </View>
          <View style={styles.item_cond}>
            <Text style={styles.item_desc}>Placas:</Text>
            <Text>{filterRecolet?.placa}</Text>
          </View>
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
  last_d: { marginBottom: -15 },
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
    textTransform: "capitalize",
  },
  dividier: { marginTop: -15 },
  main: {
    backgroundColor: "#ffffff",
    flex: 1,
    padding: "10%",
    gap: 20,
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

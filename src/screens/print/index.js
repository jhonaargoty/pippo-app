import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  DeviceEventEmitter,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { Text, Divider, Button, Overlay } from "@rneui/themed";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMyContext } from "../../../context";
import {
  BluetoothManager,
  BluetoothEscposPrinter,
} from "react-native-bluetooth-escpos-printer";

import {
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from "react-native-permissions";
import ItemList from "./ItemList";

const Index = ({ navigation, route }) => {
  const { listConductores } = useMyContext();
  const { propData } = route.params;

  console.log("PROP-", propData);

  const [pairedDevices, setPairedDevices] = useState([]);
  const [modalConfig, setModalConfig] = useState(false);
  const [foundDs, setFoundDs] = useState([]);
  const [bleOpend, setBleOpend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [boundAddress, setBoundAddress] = useState("");

  useEffect(() => {
    BluetoothManager.isBluetoothEnabled().then(
      (enabled) => {
        setBleOpend(Boolean(enabled));
        setLoading(false);
      },
      (err) => {
        err;
      }
    );

    if (Platform.OS === "ios") {
      let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
      bluetoothManagerEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
        (rsp) => {
          deviceAlreadPaired(rsp);
        }
      );
      bluetoothManagerEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_FOUND,
        (rsp) => {
          deviceFoundEvent(rsp);
        }
      );
      bluetoothManagerEmitter.addListener(
        BluetoothManager.EVENT_CONNECTION_LOST,
        () => {
          setName("");
          setBoundAddress("");
        }
      );
    } else if (Platform.OS === "android") {
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
        (rsp) => {
          deviceAlreadPaired(rsp);
        }
      );
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_FOUND,
        (rsp) => {
          deviceFoundEvent(rsp);
        }
      );
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_CONNECTION_LOST,
        () => {
          setName("");
          setBoundAddress("");
        }
      );
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
        () => {
          ToastAndroid.show(
            "Device Not Support Bluetooth !",
            ToastAndroid.LONG
          );
        }
      );
    }

    console.log(pairedDevices.length);
    if (pairedDevices.length < 1) {
      scan();
      console.log("scanning...");
    } else {
      const firstDevice = pairedDevices[0];
      console.log("length  :" + pairedDevices.length);
      console.log(firstDevice);
      connect(firstDevice);

      // connect(firstDevice);
      // console.log(pairedDevices.length + "hello");
    }
  }, [pairedDevices]);
  // deviceFoundEvent,pairedDevices,scan,boundAddress
  // boundAddress, deviceAlreadPaired, deviceFoundEvent, pairedDevices, scan

  const deviceAlreadPaired = useCallback(
    (rsp) => {
      var ds = null;
      if (typeof rsp.devices === "object") {
        ds = rsp.devices;
      } else {
        try {
          ds = JSON.parse(rsp.devices);
        } catch (e) {}
      }
      if (ds && ds.length) {
        let pared = pairedDevices;
        if (pared.length < 1) {
          pared = pared.concat(ds || []);
        }
        setPairedDevices(pared);
      }
    },
    [pairedDevices]
  );
  // const deviceAlreadPaired = useCallback(
  //   async rsp => {
  //     try {
  //       var ds = null;
  //       if (typeof rsp.devices === 'object') {
  //         ds = rsp.devices;
  //       } else {
  //         try {
  //           ds = JSON.parse(rsp.devices);
  //         } catch (e) {}
  //       }
  //       if (ds && ds.length) {
  //         let pared = pairedDevices;
  //         if (pared.length < 1) {
  //           pared = pared.concat(ds || []);
  //         }
  //         setPairedDevices(pared);
  //       }
  //     } catch (error) {
  //       // Handle any errors that occurred during the asynchronous operations
  //       console.error(error);
  //     }
  //   },
  //   [pairedDevices],
  // );

  const deviceFoundEvent = useCallback(
    (rsp) => {
      var r = null;
      try {
        if (typeof rsp.device === "object") {
          r = rsp.device;
        } else {
          r = JSON.parse(rsp.device);
        }
      } catch (e) {
        // ignore error
      }

      if (r) {
        let found = foundDs || [];
        if (found.findIndex) {
          let duplicated = found.findIndex(function (x) {
            return x.address == r.address;
          });
          if (duplicated == -1) {
            found.push(r);
            setFoundDs(found);
          }
        }
      }
    },
    [foundDs]
  );

  // const connect = (row) => {
  //   setLoading(true);
  //   BluetoothManager.connect(row.address).then(
  //     (s) => {
  //       setLoading(false);
  //       setBoundAddress(row.address);
  //       setName(row.name || "UNKNOWN");
  //       console.log("Connected to device:", row.name);
  //     },
  //     (e) => {
  //       setLoading(false);
  //       alert(e);
  //     }
  //   );
  // };

  const connect = async (row) => {
    try {
      setLoading(true);
      await BluetoothManager.connect(row.address);
      setLoading(false);
      setBoundAddress(row.address);
      setName(row.name || "UNKNOWN");
      console.log("Connected to device:", row);
    } catch (e) {
      setLoading(false);
      alert(e);
    }
  };

  const unPair = (address) => {
    setLoading(true);
    BluetoothManager.unpaire(address).then(
      (s) => {
        setLoading(false);
        setBoundAddress("");
        setName("");
      },
      (e) => {
        setLoading(false);
        alert(e);
      }
    );
  };

  const scanDevices = useCallback(() => {
    setLoading(true);
    BluetoothManager.scanDevices().then(
      (s) => {
        // const pairedDevices = s.paired;
        var found = s.found;
        try {
          found = JSON.parse(found); //@FIX_it: the parse action too weired..
        } catch (e) {
          //ignore
        }
        var fds = foundDs;
        if (found && found.length) {
          fds = found;
        }
        setFoundDs(fds);
        setLoading(false);
      },
      (er) => {
        setLoading(false);
        // ignore
      }
    );
  }, [foundDs]);

  const scan = useCallback(() => {
    try {
      async function blueTooth() {
        const permissions = {
          title: "HSD bluetooth meminta izin untuk mengakses bluetooth",
          message:
            "HSD bluetooth memerlukan akses ke bluetooth untuk proses koneksi ke bluetooth printer",
          buttonNeutral: "Lain Waktu",
          buttonNegative: "Tidak",
          buttonPositive: "Boleh",
        };

        const bluetoothConnectGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          permissions
        );
        if (bluetoothConnectGranted === PermissionsAndroid.RESULTS.GRANTED) {
          const bluetoothScanGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            permissions
          );
          if (bluetoothScanGranted === PermissionsAndroid.RESULTS.GRANTED) {
            scanDevices();
          }
        } else {
          // ignore akses ditolak
        }
      }
      blueTooth();
    } catch (err) {
      console.warn(err);
    }
  }, [scanDevices]);

  const scanBluetoothDevice = async () => {
    setLoading(true);
    try {
      const request = await requestMultiple([
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]);

      if (
        request["android.permission.ACCESS_FINE_LOCATION"] === RESULTS.GRANTED
      ) {
        scanDevices();
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  async function printreciept() {
    const x = {
      conductor: "Adrian",
      conductor_id: "5",
      fecha: "2023-10-24",
      ganadero: "Jose Wilmer Garzon Portuguez",
      ganadero_documento: "10693024272",
      ganadero_id: "22",
      id: undefined,
      litros: "20",
      name: "Jose Wilmer Garzon Portuguez",
      nameStyle: { fontSize: 14 },
      observaciones: "X",
      precio: "100",
      recoleccion_id: "49",
      ruta: "porvenir",
      subtitle: "2023-10-24",
      subtitleStyle: { color: "#c90000", fontSize: 12 },
    };

    try {
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER
      );
      await BluetoothEscposPrinter.printText(" Alimentos Pippo SAS", {
        align: "center",
      });
      await BluetoothEscposPrinter.printText("\r\n", {});
      await BluetoothEscposPrinter.printText("Parque Agroindustrial", {
        align: "center",
      });
      await BluetoothEscposPrinter.printText("\r\n", {});
      await BluetoothEscposPrinter.printText("Buenos Aires", {
        align: "center",
      });
      await BluetoothEscposPrinter.printText("\r\n", {});
      await BluetoothEscposPrinter.printText(" Guasca - Cundinamarca", {
        align: "center",
      });
      await BluetoothEscposPrinter.printText("\r\n", {});
      await BluetoothEscposPrinter.printText(" gerencia@alimentospippo.com", {
        align: "center",
      });
      await BluetoothEscposPrinter.printText("\r\n\r\n", {});
      await BluetoothEscposPrinter.printText(` Recibo de recoleccion`, {});
      await BluetoothEscposPrinter.printText("\r\n", {});
      await BluetoothEscposPrinter.printText(` Fecha: ${propData?.fecha}`, {});
      await BluetoothEscposPrinter.printText("\r\n", {});
      await BluetoothEscposPrinter.printText("----------------------", {});
      await BluetoothEscposPrinter.printText("\r\n\r\n", {});

      // Imprime la información de la ruta y el ganadero
      await BluetoothEscposPrinter.printText(` Ruta: ${propData?.ruta}`, {});
      await BluetoothEscposPrinter.printText("\r\n", {});
      await BluetoothEscposPrinter.printText(
        ` Ganadero: ${propData?.ganadero}`,
        {}
      );
      await BluetoothEscposPrinter.printText("\r\n", {});
      await BluetoothEscposPrinter.printText(
        ` Documento: ${propData?.ganadero_documento}`,
        {}
      );
      await BluetoothEscposPrinter.printText("\r\n\r\n", {});
      await BluetoothEscposPrinter.printText("----------------------", {});
      await BluetoothEscposPrinter.printText("\r\n\r\n", {});

      await BluetoothEscposPrinter.printText(
        ` Litros: ${propData?.litros || "-"}`,
        {}
      );
      await BluetoothEscposPrinter.printText("\r\n", {});
      await BluetoothEscposPrinter.printText(
        ` Observaciones: ${propData?.observaciones || "Ninguna"}`,
        {}
      );
      await BluetoothEscposPrinter.printText("\r\n", {});

      await BluetoothEscposPrinter.printText("----------------------", {});
      await BluetoothEscposPrinter.printText("\r\n\r\n", {});

      await BluetoothEscposPrinter.printText(
        ` Recolectado por: ${propData?.conductor}`,
        {}
      );
      await BluetoothEscposPrinter.printText("\r\n", {});
      await BluetoothEscposPrinter.printText(
        ` Placas: ${propData?.conductor_placas}`,
        {}
      );
      await BluetoothEscposPrinter.printText("\r\n\r\n", {});
      await BluetoothEscposPrinter.printText("\r\n\r\n", {});
    } catch (e) {
      alert(e.message || "ERROR");
    }
  }

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
          <Text>{`Fecha: ${propData?.fecha}`}</Text>
        </View>
        <Divider style={styles.dividier} />

        <View style={styles.info_lts}>
          <View>
            <View style={styles.item}>
              <Text style={styles.item_desc}>Ruta:</Text>
              <Text style={styles.capitalize}>{propData?.ruta}</Text>
            </View>
            <View style={styles.item_ganadero}>
              <Text style={styles.item_desc}>Ganadero: </Text>
              <Text>{propData?.ganadero}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.item_desc}>Documento: </Text>
              <Text>{propData?.ganadero_documento}</Text>
            </View>
          </View>
          <View>
            <View style={styles.item}>
              <Text style={styles.item_imp}>Litros</Text>
              <Text style={styles.item_imp_desc}>
                {propData?.litros || "10"}
              </Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.item_imp}>Observaciones</Text>
              <Text style={styles.item_imp_desc}>
                {propData?.observaciones || "Ninguna"}
              </Text>
            </View>
          </View>
        </View>

        <Divider style={styles.last_d} />
        <View style={styles.condc}>
          <View style={styles.item_cond}>
            <Text style={styles.item_desc}>Recolectado por:</Text>
            <Text>{propData?.conductor}</Text>
          </View>
          <View style={styles.item_cond}>
            <Text style={styles.item_desc}>Placas:</Text>
            <Text>
              {
                listConductores?.find((lc) => lc.id === propData?.conductor_id)
                  ?.placa
              }
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.buttons_print}>
        <Icon
          name="settings"
          color="black"
          onPress={() => setModalConfig(true)}
        />
        <View style={styles.buttons_print_button}>
          <Button
            onPress={() => printreciept()}
            buttonStyle={styles.button}
            title={"Imprimir"}
            icon={<Icon name="print" color="white" />}
            disabled={!boundAddress.length}
          />
        </View>
      </View>
      <Overlay isVisible={modalConfig} overlayStyle={styles.overlay} onClos>
        <View style={styles.overlay_title}>
          <Text style={styles.overlay_title_text}>Configuración</Text>

          <Text
            style={styles.overlay_title_close}
            onPress={() => setModalConfig(false)}
          >
            <Icon name="close" />
          </Text>
        </View>
        <View style={styles.overlay_content}>
          <View style={styles.overlay_list}>
            <View style={styles.container_ble}>
              <View style={styles.bluetoothStatusContainer}>
                <Icon name="bluetooth" color={bleOpend ? "green" : "red"} />
                <Text>Bluetooth {bleOpend ? "encendido" : "apagado"}</Text>
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dispositivos conectados:</Text>
            {boundAddress.length > 0 && (
              <ItemList
                label={name}
                value={boundAddress}
                onPress={() => unPair(boundAddress)}
                actionText="Desconectar"
                color="#E9493F"
              />
            )}
          </View>
          <View style={styles.section}>
            {loading ? <ActivityIndicator animating={true} /> : null}
            {pairedDevices?.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>
                  Dispositivos encontrados:
                </Text>

                <View style={styles.containerList}>
                  {pairedDevices?.map((item, index) => {
                    return (
                      <ItemList
                        key={index}
                        onPress={() => connect(item)}
                        label={item.name}
                        value={item.address}
                        connected={item.address === boundAddress}
                        actionText="Conectar"
                        color="#00BCD4"
                      />
                    );
                  })}
                </View>
              </View>
            )}
          </View>
          <Button
            buttonStyle={styles.button}
            onPress={() => scanBluetoothDevice()}
            title="Buscar impresora"
          />
        </View>
      </Overlay>
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

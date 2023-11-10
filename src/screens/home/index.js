import React, { useState, useEffect } from "react";

import { StyleSheet, View, FlatList, ImageBackground } from "react-native";
import { Button, Text, Card, Slider, Overlay, Divider } from "@rneui/themed";
import IconF from "react-native-vector-icons/FontAwesome5";
import IconF1 from "react-native-vector-icons/FontAwesome";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMyContext } from "../../../context";

import { keyExtractor, renderItem, saveData, removeData } from "../../utils";

import moment from "moment";
import "moment/locale/es";
import image from "../../assets/background.png";

const Index = ({ navigation }) => {
  moment.locale("es");

  const {
    listGanaderos,
    listRutas,
    user,
    setRutaActual,
    rutaActual,
    setListRecoleccionesLOCAL,
    listRecoleccionesLOCAL,
    listConductores,
    crearRecoleccion,
    isConnected,
    rutaActiva,
  } = useMyContext();

  const formattedDate = moment().format("dddd D [de] MMMM");
  const formattedTime = moment().format("HH:mm");

  const [toggleOverlay, setToggleOverlay] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [finalizarRuta, setFinalizarRuta] = useState(false);

  function getPercent() {
    const totalElements = listGanaderos?.filter(
      (g) => g.ruta === rutaActual?.id
    )?.length;

    const selectedElements = listRecoleccionesLOCAL?.length;
    const percentageSelected = Math.round(
      (selectedElements / totalElements) * 100
    );

    setPercentage(percentageSelected);
    return percentageSelected;
  }

  useEffect(() => {
    if (rutaActual && listRecoleccionesLOCAL && listGanaderos) {
      getPercent();
    }
  }, [rutaActual, listGanaderos, listRecoleccionesLOCAL]);

  const getColorPercent = () => {
    let calc = "";
    if (percentage < 50) {
      calc = "#c90000";
    } else if (percentage >= 50 && percentage < 99) {
      calc = "#ffc300";
    } else if (percentage >= 99) {
      calc = "#11B600";
    }

    return calc;
  };

  const saveRouteSelected = (ruta) => {
    setRutaActual(ruta);
    saveData("routeSelected", ruta);
  };

  const logout = () => {
    removeData("user");
    navigation.navigate("Login");
  };
  const borrarData = async () => {
    await removeData("user");
    await removeData("listConductores");
    await removeData("listGanaderos");
    await removeData("listRutas");
    await removeData("routeSelected");
    await removeData("listRecoleccionesLOCAL");
    await removeData("rutaActiva");

    setListRecoleccionesLOCAL([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container_info}>
        <ImageBackground source={image}>
          <View style={styles.container_info_content}>
            <View style={styles.info}>
              <View>
                <Text h3>Hola,</Text>
                <Text h4>{user?.nombre}</Text>
              </View>
              <View style={styles.info_icon}>
                <IconF
                  name="power-off"
                  color="red"
                  size={25}
                  onPress={() => {
                    logout();
                  }}
                />
              </View>
            </View>
            <View style={styles.date_placas}>
              <View style={styles.date_time}>
                <Text style={styles.date}>{formattedDate}</Text>
                <Text style={styles.date}>{formattedTime}</Text>
              </View>
              <View style={styles.placas_main}>
                <Text style={styles.placas}>{user?.placa}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/*   <Button
        title={"borrar"}
        icon={<IconF name="route" color="white" size={20} />}
        buttonStyle={styles.button}
        onPress={() => {
          borrarData();
        }}
      /> */}

      <View style={styles.buttons}>
        <View style={styles.buttons_m}>
          <Button
            title={"Ruta"}
            icon={<IconF name="route" color="white" size={20} />}
            buttonStyle={styles.button}
            onPress={() => setToggleOverlay(true)}
          />
        </View>
        <View style={styles.buttons_m}>
          <Button
            title={"Registro"}
            icon={<IconF name="plus-circle" color="white" size={20} />}
            buttonStyle={styles.button}
            onPress={() => navigation.navigate("Create")}
            disabled={!rutaActiva}
          />
        </View>
      </View>

      <View style={styles.flex}>
        <Card
          containerStyle={{ borderRadius: 10, margin: 0, marginBottom: 20 }}
        >
          <View style={styles.card_route}>
            <IconF name="location-arrow" color="black" />
            <Text>Ruta:</Text>
            <Text style={styles.route_name}>{rutaActual?.nombre}</Text>
          </View>

          <View style={styles.card_route}>
            <View style={styles.card_slider}>
              <Slider
                disabled
                maximumValue={100}
                minimumValue={0}
                style={{ width: "94%", height: 50 }}
                thumbStyle={{ height: 1, width: 1 }}
                thumbProps={{
                  children: (
                    <Icon
                      name="local-shipping"
                      size={20}
                      containerStyle={{
                        bottom: 19,
                        right: percentage === 0 ? 0 : 20,
                        width: 20,
                        height: 20,
                      }}
                      color={getColorPercent()}
                    />
                  ),
                }}
                minimumTrackTintColor={getColorPercent()}
                trackStyle={{
                  height: 5,
                  borderRadius: 20,
                }}
                value={percentage}
              />
              <View style={styles.card_slider_icon}>
                <IconF name="flag-checkered" size={20} />
              </View>
            </View>
          </View>

          <View style={styles.card_percent}>
            <Text>Recorrido</Text>
            <Text>{percentage}%</Text>
          </View>
        </Card>

        <Card
          containerStyle={{
            borderRadius: 10,
            margin: 0,
            flex: 1,
            paddingBottom: 80,
            marginBottom: 20,
          }}
        >
          <Card.Title>Ultimas recolecciones</Card.Title>
          <Card.Divider />

          {listRecoleccionesLOCAL?.length ? (
            <FlatList
              style={{ height: "auto" }}
              keyExtractor={keyExtractor}
              data={listRecoleccionesLOCAL?.map((item) => {
                return {
                  ...item,
                  id: item.id,
                  name: listGanaderos?.find(
                    (c) => c.id === item.ganadero || c.id === item.ganadero_id
                  )?.nombre,
                  subtitle: item?.fecha,
                  subtitleStyle: styles.subtitle,
                  nameStyle: styles.last_title_name,
                };
              })}
              renderItem={({ item }) =>
                renderItem({
                  item,
                  onPress: () =>
                    navigation.navigate("Print", {
                      propData: {
                        litros: item.litros,
                        observaciones: item.observaciones,
                        fecha: item.fecha,
                        ganadero: listGanaderos.find(
                          (g) => g.id === item.ganadero
                        ).nombre,
                        conductor: listConductores.find(
                          (g) => g.id === user?.id
                        ).nombre,
                        ruta: listRutas.find((r) => r.id === rutaActual.id)
                          .nombre,
                        conductor_id: user?.id,
                        ganadero_documento: listGanaderos.find(
                          (g) => g.id === item.ganadero
                        ).documento,
                      },
                    }),
                })
              }
            />
          ) : (
            <View style={styles.not_data}>
              <IconF1 name="warning" size={25} />
              <Text>Sin datos</Text>
            </View>
          )}
        </Card>

        <Button
          title={"Finalizar ruta"}
          icon={<IconF name="route" color="white" size={20} />}
          buttonStyle={styles.button}
          onPress={() => {
            setFinalizarRuta(true);
          }}
          disabled={
            !listRecoleccionesLOCAL?.length || !isConnected || !rutaActiva
          }
        />

        <Overlay isVisible={finalizarRuta} overlayStyle={styles.overlay_finish}>
          <View style={styles.title_overlay_finish}>
            <Text style={styles.overlay_text_finish}>
              {"¿Desea terminar la ruta?"}
            </Text>
          </View>
          <View style={styles.overlay_f_b}>
            <Button
              title={"Cancelar"}
              buttonStyle={{
                backgroundColor: "rgba(214, 61, 57, 1)",
                borderRadius: 20,
                paddingHorizontal: 30,
              }}
              onPress={() => {
                setFinalizarRuta(false);
              }}
            />
            <Button
              title={"Aceptar"}
              buttonStyle={{
                borderRadius: 20,
                paddingHorizontal: 30,
              }}
              onPress={() => {
                setFinalizarRuta(false);
                crearRecoleccion();
              }}
            />
          </View>
        </Overlay>

        <Overlay isVisible={toggleOverlay} overlayStyle={styles.overlay}>
          <View style={styles.title_overlay}>
            <Text style={styles.overlay_text}>{"Cambiar ruta"}</Text>
            <IconF1
              style={styles.overlay_close}
              name="close"
              color="#c90000"
              onPress={() => setToggleOverlay(false)}
              size={20}
            />
          </View>
          <Divider />
          <View style={styles.overlay_list}>
            <FlatList
              keyExtractor={keyExtractor}
              data={listRutas?.map((item) => {
                return {
                  ...item,
                  name: item.nombre,
                  nameStyle: styles.name_style,
                };
              })}
              renderItem={({ item }) =>
                renderItem({
                  item,
                  onPress: () => {
                    saveRouteSelected(item);
                    setToggleOverlay(false);
                  },
                })
              }
            />
          </View>
        </Overlay>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title_overlay_finish: {
    justifyContent: "center",
    alignItems: "center",
  },
  overlay_text_finish: { fontSize: 18 },
  overlay_f_b: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  overlay_finish: {
    padding: 30,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 50,
  },
  last_title_name: { fontSize: 14 },
  name_style: { textTransform: "capitalize" },
  not_data: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  container_info_content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 30,
  },
  container_info: {
    overflow: "hidden",
    borderRadius: 10,
  },
  subtitle: { color: "#c90000", fontSize: 12 },
  last_title: { marginBottom: 20, fontWeight: "bold" },
  flex: { flex: 1 },
  /* last: { flex: 1 }, */
  card_percent: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: -20,
    gap: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
    height: "100%",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
  },
  info_icon: { width: 30 },
  buttons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttons_m: { width: "49%" },
  button: {
    backgroundColor: "#c90000",
    borderRadius: 20,
    gap: 10,
  },
  card_route: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  card_slider_icon: { marginBottom: 20, marginRight: 10 },
  card_slider: {
    width: "100%",
    flexDirection: "row",
  },
  date: { textTransform: "capitalize" },
  last: { marginTop: 20, height: 500 },
  overlay: { padding: 20, width: "90%", height: "50%", borderRadius: 20 },

  overlay_list: {
    flex: 1,
  },

  date_placas: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  placas_main: {
    backgroundColor: "#ffcc00",
    paddingHorizontal: 1,
    paddingVertical: 1,
  },
  placas: {
    textTransform: "uppercase",
    fontWeight: "bold",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  title_overlay: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignContent: "center",
    marginBottom: 20,
  },
  overlay_text: {
    fontSize: 20,
    textAlign: "center",
    color: "#c90000",
    width: "90%",
  },
  overlay_close: { top: 3 },
  route_name: {
    fontWeight: "bold",
    fontSize: 15,
    textDecorationLine: "underline",
    textTransform: "capitalize",
  },
});

export default Index;

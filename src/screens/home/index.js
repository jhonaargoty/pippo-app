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
    listRecolecciones,
    user,
    setRutaActual,
    rutaActual,
  } = useMyContext();

  const formattedDateTime = moment().format("dddd D [de] MMMM : HH:mm");

  const [toggleOverlay, setToggleOverlay] = useState(false);
  const [percentage, setPercentage] = useState(0);

  function getPercent() {
    const totalElements = listGanaderos?.filter(
      (g) => g.ruta === rutaActual?.id
    )?.length;

    const selectedElements = listRecolecciones?.length;
    const percentageSelected = Math.round(
      (selectedElements / totalElements) * 100
    );

    setPercentage(percentageSelected);
    return percentageSelected;
  }

  useEffect(() => {
    if (rutaActual && listRecolecciones && listGanaderos) {
      getPercent();
    }
  }, [rutaActual, listGanaderos, listRecolecciones]);

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
  const borrarData = () => {
    removeData("user");
    removeData("ganaderos");
    removeData("conductores");
    removeData("rutas");
    removeData("routeSelected");
    removeData("recoleccione");
    navigation.navigate("Login");
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
              <Text style={styles.date}>{formattedDateTime}</Text>
              <View style={styles.placas_main}>
                <Text style={styles.placas}>{user?.placa}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      <Button
        title={"borrar"}
        icon={<IconF name="route" color="white" size={20} />}
        buttonStyle={styles.button}
        onPress={() => {
          borrarData();
        }}
      />

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
          }}
        >
          <Card.Title>Ultimas recolecciones</Card.Title>
          <Card.Divider />

          {listRecolecciones?.length ? (
            <FlatList
              style={{ height: "auto" }}
              keyExtractor={keyExtractor}
              data={listRecolecciones?.map((item) => {
                return {
                  ...item,
                  id: item.id,
                  name: item.ganadero,
                  subtitle: item.fecha,
                  subtitleStyle: styles.subtitle,
                  nameStyle: styles.last_title_name,
                };
              })}
              renderItem={({ item }) =>
                renderItem({
                  item,
                  onPress: () =>
                    navigation.navigate("Print", { propData: item }),
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

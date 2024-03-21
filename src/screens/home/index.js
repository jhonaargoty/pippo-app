/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";

import { View, ImageBackground, Image, ActivityIndicator } from "react-native";
import { Button, Text, Card, Slider, LinearProgress } from "@rneui/themed";
import IconF from "react-native-vector-icons/FontAwesome5";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMyContext } from "../../../context";

import { fetchSaveRutaActual, fectDeletesession } from "../../../context_const";

import moment from "moment";
import "moment/locale/es";
import image from "../../assets/background.png";

import CarmbiarRuta from "./components/cambiarRuta";
import FinalizarRuta from "./components/finalizarRuta";
import Sync from "./components/sync";

import { styles } from "./styles";
import { sumarLitros } from "../../utils/voucherDia";
import UltimasRecolecciones from "./components/ultimasRecolecciones";
import AnalisisRutas from "./components/analisisRutas";

const Index = ({ navigation }) => {
  moment.locale("es");

  const {
    listGanaderos,
    listRutas,
    user,
    setUser,
    setRutaActual,
    rutaActual,
    listRecoleccionesLOCAL,
    listConductores,
    isConnected,
    rutaActiva,
    fetchData,
    sync,
    setSync,
    syncMessage,
    syncLoading,
  } = useMyContext();

  const formattedDate = moment().format("dddd D [de] MMMM");
  const formattedTime = moment().format("HH:mm");

  const [toggleOverlay, setToggleOverlay] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [finalizarRuta, setFinalizarRuta] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  function getPercent() {
    const totalElements = listGanaderos?.filter(
      (g) => parseInt(g.ruta) === parseInt(rutaActual?.id)
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
    fetchSaveRutaActual(ruta);
    setRutaActual(ruta);
  };

  const colorButtons = (value) => {
    return value ? "#b5b5b5" : "#c90000";
  };

  const getIconSlider = () => {
    return (
      <View style={{ width: 100 }}>
        <Icon
          name="local-shipping"
          size={40}
          containerStyle={{
            bottom: 34,
            right: percentage === 0 ? 0 : 20,
            width: 40,
            height: 40,
          }}
          color={getColorPercent()}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#c90000" />
          <Text style={styles.text_loading}>Cargando datos...</Text>
        </View>
      ) : (
        <>
          <View style={styles.container_info}>
            <ImageBackground source={image}>
              <View style={styles.container_info_content}>
                <View style={styles.info}>
                  <View>
                    <Text h3 style={styles.text_header}>
                      Hola,
                    </Text>

                    {user?.nombre === "X" && (
                      <Button
                        style={styles.button}
                        onPress={() => {
                          fectDeletesession();
                          setUser(null);
                        }}
                      >
                        cerrar sesion
                      </Button>
                    )}
                    <Text h4 style={styles.text_header}>
                      {user?.nombre || user?.usuario?.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.info_icon_logos}>
                    <Image
                      style={styles.logo}
                      source={require("../../assets/lola.png")}
                    />
                    <Image
                      style={styles.logo_pippo}
                      source={require("../../assets/logo_pipo.png")}
                    />
                  </View>
                </View>

                <View style={styles.date_placas}>
                  <View style={styles.date_time}>
                    <Text style={styles.date}>{formattedDate}</Text>
                    <Text style={styles.date}>{formattedTime}</Text>
                  </View>
                  {user?.tipo !== "2" && (
                    <View style={styles.placas_main}>
                      <Text style={styles.placas}>{user?.placa}</Text>
                    </View>
                  )}
                </View>
              </View>
            </ImageBackground>
          </View>

          <View style={styles.flex}>
            {user?.tipo !== "2" && (
              <>
                <Card containerStyle={styles.card_standar}>
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
                          children: getIconSlider(),
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
                    <Text>-</Text>
                    <Text>{sumarLitros(listRecoleccionesLOCAL)} lts</Text>
                  </View>
                </Card>

                <UltimasRecolecciones
                  listRecoleccionesLOCAL={listRecoleccionesLOCAL}
                  listGanaderos={listGanaderos}
                  listConductores={listConductores}
                  user={user}
                  navigation={navigation}
                  rutaActual={rutaActual}
                  listRutas={listRutas}
                />
                <FinalizarRuta
                  finalizarRuta={finalizarRuta}
                  setFinalizarRuta={setFinalizarRuta}
                />

                <Sync
                  visible={sync}
                  close={() => setSync(false)}
                  message={syncMessage}
                  loading={syncLoading}
                />

                <CarmbiarRuta
                  toggleOverlay={toggleOverlay}
                  listRutas={listRutas}
                  setToggleOverlay={setToggleOverlay}
                  saveRouteSelected={saveRouteSelected}
                />
                <View style={styles.footer}>
                  <Button
                    icon={
                      <IconF
                        name="redo-alt"
                        size={20}
                        color={colorButtons(!isConnected)}
                      />
                    }
                    title="Sync"
                    iconPosition="top"
                    buttonStyle={styles.footer_icon}
                    onPress={() => fetchData()}
                    disabled={!isConnected || syncLoading}
                    titleStyle={{ color: "black", fontSize: 14 }}
                  />
                  <Button
                    disabled={!rutaActiva}
                    icon={
                      <IconF
                        name="route"
                        size={20}
                        color={colorButtons(!rutaActiva)}
                      />
                    }
                    title="Ruta"
                    iconPosition="top"
                    buttonStyle={styles.footer_icon}
                    onPress={() => setToggleOverlay(true)}
                    titleStyle={{ color: "black", fontSize: 14 }}
                  />

                  <Button
                    icon={
                      <IconF
                        name="plus-circle"
                        size={20}
                        color={colorButtons(!rutaActiva)}
                      />
                    }
                    title="Registro"
                    iconPosition="top"
                    buttonStyle={styles.footer_icon}
                    onPress={() => navigation.navigate("Create")}
                    disabled={!rutaActiva}
                    titleStyle={{ color: "black", fontSize: 14 }}
                  />
                  {/*  <Button
              icon={
                <IconF
                  name="plus-circle"
                  size={20}
                  color={colorButtons(!rutaActiva)}
                />
              }
              title="GPS"
              iconPosition="top"
              buttonStyle={styles.footer_icon}
              onPress={() => navigation.navigate("gps")}
             
            /> */}
                  <Button
                    icon={
                      <IconF
                        name="print"
                        size={20}
                        color={colorButtons(!listRecoleccionesLOCAL?.length)}
                      />
                    }
                    title="Diario"
                    iconPosition="top"
                    buttonStyle={styles.footer_icon}
                    onPress={() => navigation.navigate("VoucherDia")}
                    disabled={!listRecoleccionesLOCAL?.length}
                    titleStyle={{ color: "black", fontSize: 14 }}
                  />

                  {!rutaActiva ? (
                    <Button
                      onPress={() => {
                        setFinalizarRuta(true);
                      }}
                      buttonStyle={styles.footer_icon}
                      icon={
                        <IconF
                          name="flag-checkered"
                          size={20}
                          color={"green"}
                        />
                      }
                      title={"Iniciar"}
                      iconPosition="top"
                      titleStyle={{ color: "black", fontSize: 14 }}
                    />
                  ) : (
                    <Button
                      disabled={!listRecoleccionesLOCAL?.length || !isConnected}
                      onPress={() => {
                        setFinalizarRuta(true);
                      }}
                      buttonStyle={styles.footer_icon}
                      icon={
                        <IconF
                          name="flag-checkered"
                          size={20}
                          color={colorButtons(
                            !listRecoleccionesLOCAL?.length || !isConnected
                          )}
                        />
                      }
                      title={"Finalizar"}
                      iconPosition="top"
                      titleStyle={{ color: "black", fontSize: 14 }}
                    />
                  )}
                  {/* <Button
              onPress={() => {
                borrarData();
              }}
              buttonStyle={styles.footer_icon}
              icon={
                <IconF
                  name="flag-checkered"
                  size={20}
                  color={colorButtons(false)}
                />
              }
              title={"Borrar"}
              iconPosition="top"
              titleStyle={{ color: "black", fontSize: 14 }}
            /> */}
                </View>
              </>
            )}

            {user?.tipo === "2" && <AnalisisRutas navigation={navigation} />}
          </View>
        </>
      )}
      {syncLoading && <LinearProgress style={styles.bottomView} color="red" />}
    </SafeAreaView>
  );
};

export default Index;

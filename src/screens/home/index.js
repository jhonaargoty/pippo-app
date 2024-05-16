/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";

import { View, ActivityIndicator } from "react-native";
import { Text, Card, Slider } from "@rneui/themed";
import IconF from "react-native-vector-icons/FontAwesome5";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMyContext } from "../../../context";

import { fetchSaveRutaActual } from "../../../context_const";

import moment from "moment";
import "moment/locale/es";

import CambiarRuta from "./components/cambiarRuta";
import FinalizarRuta from "./components/finalizarRuta";
import FinalizarRutaEstado from "./components/finalizarRutaEstado";
import Sync from "./components/sync";

import { styles } from "./styles";
import { sumarLitros } from "../../utils/voucherDia";
import UltimasRecolecciones from "./components/ultimasRecolecciones";
import AnalisisRutas from "./components/analisisRutas";
import ButtonsFooter from "./components/ButtonsFooter";
import Header from "./components/header";

const Index = ({ navigation }) => {
  moment.locale("es");

  const {
    listGanaderos,
    listRutas,
    user,
    setRutaActual,
    rutaActual,
    listRecoleccionesLOCAL,
    sync,
    setSync,
    syncMessage,
    syncLoading,
    recoleccionesCreadas,
    setRecoleccionesCreadas,
  } = useMyContext();

  const [toggleOverlay, setToggleOverlay] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [finalizarRuta, setFinalizarRuta] = useState(false);

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

  const ANALISIS_PERMISSIONS = [2, 3, 4];

  return (
    <SafeAreaView style={styles.container}>
      {syncLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#c90000" />
          <Text style={styles.text_loading}>Sincronizando datos...</Text>
        </View>
      ) : (
        <>
          <Header navigation={navigation} />

          <View style={styles.flex}>
            {parseInt(user?.tipo) === 1 && (
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
                  navigation={navigation}
                />
                <FinalizarRuta
                  finalizarRuta={finalizarRuta}
                  setFinalizarRuta={setFinalizarRuta}
                />
                <FinalizarRutaEstado
                  open={!!Object.keys(recoleccionesCreadas).length}
                  recoleccionesCreadas={recoleccionesCreadas}
                  close={setRecoleccionesCreadas}
                />

                <Sync
                  visible={sync}
                  close={() => setSync(false)}
                  message={syncMessage}
                  loading={syncLoading}
                />

                <CambiarRuta
                  toggleOverlay={toggleOverlay}
                  listRutas={listRutas}
                  setToggleOverlay={setToggleOverlay}
                  saveRouteSelected={saveRouteSelected}
                />
              </>
            )}

            {ANALISIS_PERMISSIONS.includes(parseInt(user?.tipo)) && (
              <AnalisisRutas navigation={navigation} />
            )}

            <ButtonsFooter
              setToggleOverlay={setToggleOverlay}
              navigation={navigation}
              setFinalizarRuta={setFinalizarRuta}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Index;

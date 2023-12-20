import React from "react";
import { Text, Overlay, Button } from "@rneui/themed";
import { View } from "react-native";

import { useMyContext } from "../../../../../context";

import {
  fetchSaveRutaActiva,
  fectDeleteRecolecciones,
} from "../../../../../context_const";

import { styles } from "../../styles";

function Index({ finalizarRuta, setFinalizarRuta }) {
  const {
    crearRecoleccion,
    rutaActiva,
    setRutaActiva,
    setListRecoleccionesLOCAL,
  } = useMyContext();

  return (
    <Overlay isVisible={finalizarRuta} overlayStyle={styles.overlay_finish}>
      <View style={styles.title_overlay_finish}>
        <Text style={styles.overlay_text_finish}>
          {`¿Desea ${rutaActiva ? "terminar" : "iniciar"} la ruta?`}
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

            if (!rutaActiva) {
              setRutaActiva(true);
              fetchSaveRutaActiva(true);
              fectDeleteRecolecciones(setListRecoleccionesLOCAL);
            } else {
              crearRecoleccion();
              setRutaActiva(false);
              fetchSaveRutaActiva(false);
            }
          }}
        />
      </View>
    </Overlay>
  );
}

export default Index;

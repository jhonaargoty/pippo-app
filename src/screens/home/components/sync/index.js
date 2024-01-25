import React from "react";
import { Text, Overlay, Button } from "@rneui/themed";
import { View } from "react-native";

import { useMyContext } from "../../../../../context";

import {
  fetchSaveRutaActiva,
  fectDeleteRecolecciones,
} from "../../../../../context_const";

import { styles } from "../../styles";

function Index({ visible, close, message }) {
  const {} = useMyContext();

  return (
    <Overlay isVisible={visible} overlayStyle={styles.overlay_finish}>
      <View style={styles.title_overlay_finish}>
        <Text style={styles.overlay_text_finish}>{message}</Text>
      </View>
      <View style={styles.overlay_f_b_1}>
        <Button
          title={"Aceptar"}
          buttonStyle={{
            borderRadius: 20,
            paddingHorizontal: 30,
          }}
          onPress={() => {
            close();
          }}
        />
      </View>
    </Overlay>
  );
}

export default Index;

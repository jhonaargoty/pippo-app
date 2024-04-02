import React from "react";
import { Text, Overlay, Button } from "@rneui/themed";
import { View } from "react-native";

import { styles } from "../../styles";

function Index({ open, close, recoleccionesCreadas }) {
  const messages = {
    success: "Ruta finalizada y recolecciones guardadas con éxito",
    error: "Error al finalizar la ruta, intente de nuevo",
  };

  return (
    <Overlay isVisible={open} overlayStyle={styles.overlay_finish_2}>
      <View style={styles.title_overlay_finish}>
        <Text style={styles.overlay_text_finish}>
          {messages[recoleccionesCreadas?.type]}
        </Text>
      </View>
      <View style={styles.overlay_f_b_2}>
        <Button
          title={"Cerrar"}
          buttonStyle={{
            backgroundColor: "rgba(214, 61, 57, 1)",
            borderRadius: 20,
            paddingHorizontal: 30,
          }}
          onPress={() => {
            close({});
          }}
        />
      </View>
    </Overlay>
  );
}

export default Index;

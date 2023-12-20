import React from "react";
import { Text, Overlay, Divider } from "@rneui/themed";
import { View, FlatList } from "react-native";
import IconF1 from "react-native-vector-icons/FontAwesome";
import { keyExtractor, renderItem } from "../../../../utils";

import { styles } from "../../styles";

function Index({
  toggleOverlay,
  listRutas,
  setToggleOverlay,
  saveRouteSelected,
}) {
  return (
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
  );
}

export default Index;

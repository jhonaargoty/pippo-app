import React from "react";

import { Text, Card } from "@rneui/themed";
import { View, FlatList } from "react-native";
import IconF1 from "react-native-vector-icons/FontAwesome";

import { renderItem } from "../../../utils";

import { styles } from "../styles";

function UltimasRecolecciones({
  listRecoleccionesLOCAL,
  listGanaderos,
  navigation,
}) {
  return (
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

      {listRecoleccionesLOCAL?.length ? (
        <FlatList
          style={{ height: "auto" }}
          keyExtractor={(item) => item.id}
          data={listRecoleccionesLOCAL?.map((item) => {
            return {
              ...item,
              id: item.id,
              name: listGanaderos?.find(
                (c) =>
                  parseInt(c.id) === parseInt(item.ganadero) ||
                  parseInt(c.id) === parseInt(item.ganadero_id)
              )?.nombre,
              subtitle: `Litros: ${item.litros}`,
              subtitleStyle: styles.subtitle,
              nameStyle: styles.last_title_name,
            };
          })}
          renderItem={({ item }) =>
            renderItem({
              item,
              onPress: () =>
                navigation.navigate("Print", {
                  propData: { id: item.ganadero },
                }),
            })
          }
        />
      ) : (
        <View style={styles.not_data}>
          <IconF1 name="warning" size={25} />
          <Text>Sin recolecciones el dia de hoy</Text>
        </View>
      )}
    </Card>
  );
}

export default UltimasRecolecciones;

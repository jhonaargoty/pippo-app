import React from "react";

import { Text, Card } from "@rneui/themed";
import { View, FlatList } from "react-native";
import IconF1 from "react-native-vector-icons/FontAwesome";

import { keyExtractor, renderItem } from "../../../utils";

import { styles } from "../styles";

function UltimasRecolecciones({
  listRecoleccionesLOCAL,
  listGanaderos,
  listConductores,
  user,
  navigation,
  rutaActual,
  listRutas,
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
          keyExtractor={keyExtractor}
          data={listRecoleccionesLOCAL?.map((item) => {
            return {
              ...item,
              id: item.id,
              name: listGanaderos?.find(
                (c) =>
                  parseInt(c.id) === parseInt(item.ganadero) ||
                  parseInt(c.id) === parseInt(item.ganadero_id)
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
                      (g) => parseInt(g.id) === parseInt(item.ganadero)
                    ).nombre,
                    conductor: listConductores.find(
                      (g) => parseInt(g.id) === parseInt(user?.id)
                    ).nombre,
                    ruta: listRutas.find(
                      (r) => parseInt(r.id) === parseInt(rutaActual.id)
                    ).nombre,
                    conductor_id: parseInt(user?.id),
                    ganadero_documento: listGanaderos.find(
                      (g) => parseInt(g.id) === parseInt(item.ganadero)
                    ).documento,
                  },
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

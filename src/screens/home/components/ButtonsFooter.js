import React from "react";

import { View } from "react-native";
import { Button } from "@rneui/themed";
import { styles } from "../styles";
import IconF from "react-native-vector-icons/FontAwesome5";

import { useMyContext } from "../../../../context";

function ButtonsFooter({ setToggleOverlay, navigation, setFinalizarRuta }) {
  const {
    listRecoleccionesLOCAL,
    isConnected,
    rutaActiva,
    fetchData,
    syncLoading,
    user,
  } = useMyContext();

  const colorButtons = (value) => {
    return value ? "#b5b5b5" : "#c90000";
  };
  return (
    <View style={styles.footer}>
      {user?.tipo === 1 && (
        <>
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
              <IconF name="route" size={20} color={colorButtons(!rutaActiva)} />
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
              icon={<IconF name="flag-checkered" size={20} color={"green"} />}
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
        </>
      )}
    </View>
  );
}

export default ButtonsFooter;

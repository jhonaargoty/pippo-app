import React, { useEffect, useState } from "react";
import { View, Modal, ScrollView, ActivityIndicator } from "react-native";
import { Text, Divider, Button, LinearProgress } from "@rneui/themed";

import { SafeAreaView } from "react-native-safe-area-context";

import { useMyContext } from "../../../context";

import { styles } from "./styles";

import axios from "axios";

import moment from "moment";
import "moment/locale/es";

import { BASE_URL } from "../../constants";
import Form from "./form";

const Index = ({ route }) => {
  moment.locale("es");
  const { user, listRutas } = useMyContext();
  const { propData } = route.params;

  const [isError, setIsError] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [loadingRecolect, setLoadingRecolect] = useState(false);

  const today = moment().format("YYYY-MM-DD");

  const [analisisById, setAnalisisById] = useState([]);

  const fetchAnalisisByIdRecolect = async (id_recoleccion) => {
    setLoadingRecolect(true);
    try {
      const recolecciones = await axios.get(
        `${BASE_URL}analisis/getAnalisisByIDRecolect.php?id_recoleccion=${id_recoleccion}`
      );
      setAnalisisById(recolecciones.data);
    } catch (error) {
      console.error("Error en las solicitudes:", error);
    }
    setLoadingRecolect(false);
  };

  useEffect(() => {
    fetchAnalisisByIdRecolect(propData?.id);
  }, [propData?.id]);

  const [compartimientoSelect, setCompartimientoSelect] = useState(1);

  const calculateCompartimiento = () => {
    const compartimientos = [];

    for (let i = 1; i <= 3; i++) {
      compartimientos.push(`Compartimiento ${i}`);
    }

    return compartimientos;
  };

  const [analisisFormData, setAnalisisFormData] = useState({});

  useEffect(() => {
    if (analisisById && compartimientoSelect) {
      const filteredAnalisis = analisisById.find(
        (a) => parseInt(a.compartimiento) === parseInt(compartimientoSelect)
      );

      setAnalisisFormData(filteredAnalisis);
    }
  }, [analisisById, compartimientoSelect]);

  return (
    <SafeAreaView style={styles.container}>
      {loadingRecolect ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#c90000" />
          <Text style={styles.loading_text}>Cargando analisis...</Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.info_navigation}>
            <View style={styles.info_main}>
              <View style={styles.info}>
                <Text h3 style={styles.info_ruta}>
                  Analisis
                </Text>
              </View>
              <Text
                h4
                style={styles.info_ruta}
              >{`Ruta: ${propData?.name}`}</Text>
              <Text style={styles.litros}>Litros: {propData?.litros}</Text>
              <Text h5 style={styles.date}>
                Fecha recolección: {analisisFormData?.fecha || propData?.fecha}
              </Text>
              <Text h5 style={styles.date}>
                Fecha analisis: {analisisFormData?.fecha_recoleccion || today}
              </Text>
              <Text h5 style={styles.date}>
                Compartimiento: {compartimientoSelect}
              </Text>
              <Text
                h5
                style={[
                  styles.date,
                  styles[analisisFormData?.estado || "pendiente"],
                ]}
              >
                Estado: {analisisFormData?.estado || "pendiente"}
              </Text>
            </View>
            <Divider />
          </View>
          <View style={styles.compartimientos}>
            {calculateCompartimiento().map((_, index) => (
              <Button
                buttonStyle={[
                  styles.compartimiento,
                  compartimientoSelect === index + 1 &&
                    styles.compartimiento_selected,
                ]}
                key={index}
                onPress={() => {
                  setCompartimientoSelect(index + 1);
                }}
              >
                <Text
                  style={
                    compartimientoSelect === index + 1 &&
                    styles.compartimiento_selected
                  }
                >
                  C/miento {index + 1}
                </Text>
              </Button>
            ))}
          </View>

          <View style={styles.card_view}>
            <Form
              analisisFormData={analisisFormData}
              setIsError={setIsError}
              setLoadingSave={setLoadingSave}
              propData={propData}
              user={user}
              compartimientoSelect={compartimientoSelect}
              setIsModal={setIsModal}
              loadingSave={loadingSave}
            />
          </View>

          <Modal animationType="slide" transparent={true} visible={isModal}>
            <View style={styles.is_modal}>
              <View style={styles.modal_view}>
                <Text style={styles.modal_text}>
                  {isError
                    ? "! Error, intente de nuevo !"
                    : "! Analisis guardado !"}{" "}
                </Text>
                <Button
                  title="Cerrar"
                  onPress={() => {
                    fetchAnalisisByIdRecolect(propData?.id);
                    setIsModal(false);
                  }}
                  buttonStyle={{ borderRadius: 10 }}
                  titleStyle={{ paddingHorizontal: 10, fontSize: 14 }}
                  color={"green"}
                />
              </View>
            </View>
          </Modal>
          {loadingSave && (
            <LinearProgress style={styles.bottomView} color="red" />
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Index;

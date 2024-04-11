import React, { useEffect, useState } from "react";
import {
  View,
  Keyboard,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Text, Divider, Card, Button, LinearProgress } from "@rneui/themed";

import { Icon } from "react-native-elements";

import { SafeAreaView } from "react-native-safe-area-context";

import { useForm, Controller } from "react-hook-form";

import { useMyContext } from "../../../context";

import { styles } from "./styles";

import axios from "axios";

import moment from "moment";
import "moment/locale/es";

import { BASE_URL } from "../../constants";

const Index = ({ route }) => {
  moment.locale("es");
  const { user, listRutas } = useMyContext();
  const { propData } = route.params;

  const [isError, setIsError] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [isModal, setIsModal] = useState(false);

  const today = moment().format("YYYY-MM-DD");

  const [analisisById, setAnalisisById] = useState([]);

  const fetchAnalisisByIdRecolect = async (id_recoleccion) => {
    try {
      const recolecciones = await axios.get(
        `${BASE_URL}analisis/getAnalisisByIDRecolect.php?id_recoleccion=${id_recoleccion}`
      );
      setAnalisisById(recolecciones.data);
    } catch (error) {
      console.error("Error en las solicitudes:", error);
    }
  };

  useEffect(() => {
    fetchAnalisisByIdRecolect(propData?.id);
  }, [propData?.id]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    reset,
  } = useForm();

  const onSubmit = async (data, status) => {
    setLoadingSave(true);
    setIsError(false);

    const body = {
      id_recoleccion: parseInt(propData?.id),
      fecha: today,
      fecha_recoleccion: propData?.fecha,
      ruta: propData?.ruta_id,
      usuario: user?.id,
      compartimiento: compartimientoSelect,
      observaciones: data.observaciones,
      silo: data.silo,
      temperatura: data.temperatura,
      acidez: data.acidez,
      alcohol: data.alcohol,
      ph: data.ph,
      densidad: data.densidad,
      grasa: data.grasa,
      proteina: data.proteina,
      ciloscopia: data.ciloscopia,
      antibiotico: data.antibiotico,
      solidos_no_grasos: data.solidos_no_grasos,
      solidos_totales: data.solidos_totales,
      neutralizante: data.neutralizante,
      cloruros: data.cloruros,
      peroxido: data.peroxido,
      peroxdata: data.peroxdata,
      fosfadata: data.fosfadata,
      almidon: data.almidon,
      prueba_suero: data.prueba_suero,
      estado: status,
    };

    const url = await `${BASE_URL}/analisis/addAnalisis.php`;

    await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        item: {
          ...body,
        },
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          setIsModal(true);
        }
        if (response.status === 400) {
          setIsModal(true);
          setIsError(true);
        }
      })
      .catch((error) => {
        setIsError(true);
        setIsModal(true);
      });

    setLoadingSave(false);

    Keyboard.dismiss();
  };

  const positivo_negativo = [{ name: "positivo" }, { name: "negativo" }];

  const FORM_FIELDS = [
    { name: "silo", type: "text", icon: "local-drink" },
    { name: "temperatura", type: "text", icon: "thermostat" },
    { name: "acidez", type: "text", icon: "local-fire-department" },
    { name: "alcohol", type: "text", icon: "science" },
    { name: "ph", type: "text", icon: "device-hub" },
    { name: "densidad", type: "text", icon: "shower" },
    { name: "grasa", type: "text", icon: "oil-barrel" },
    { name: "proteina", type: "text", icon: "timeline" },
    { name: "ciloscopia", type: "text", icon: "coronavirus" },
    { name: "solidos_no_grasos", type: "text", icon: "lens-blur" },
    { name: "solidos_totales", type: "text", icon: "lens-blur" },
    {
      name: "antibiotico",
      type: "radio",
      options: positivo_negativo,
      icon: "vaccines",
    },
    {
      name: "neutralizante",
      type: "radio",
      options: positivo_negativo,
      icon: "close-fullscreen",
    },
    {
      name: "cloruros",
      type: "radio",
      options: positivo_negativo,
      icon: "gas-meter",
    },
    {
      name: "peroxido",
      type: "radio",
      options: positivo_negativo,
      icon: "webhook",
    },
    {
      name: "peroxdata",
      type: "radio",
      options: positivo_negativo,
      icon: "all-out",
    },
    {
      name: "fosfadata",
      type: "radio",
      options: positivo_negativo,
      icon: "whatshot",
    },
    {
      name: "almidon",
      type: "radio",
      options: positivo_negativo,
      icon: "breakfast-dining",
    },
    {
      name: "prueba_suero",
      type: "radio",
      options: positivo_negativo,
      icon: "biotech",
    },
    {
      name: "observaciones",
      type: "textarea",
      icon: "sticky-note-2",
    },
  ];

  const [compartimientoSelect, setCompartimientoSelect] = useState(1);

  const calculateCompartimiento = () => {
    const compartimientos = [];
    const compartimientosRuta =
      listRutas?.find((r) => parseInt(r.id) === parseInt(propData?.ruta_id))
        ?.compartimientos || 0;

    if (compartimientosRuta > 0) {
      for (let i = 1; i <= compartimientosRuta; i++) {
        compartimientos.push(`Compartimiento ${i}`);
      }
    } else {
      compartimientos.push("Compartimiento 1");
    }

    return compartimientos;
  };

  const getDataAnalisisCompartimiento = () => {
    return (
      analisisById?.find(
        (a) => parseInt(a.compartimiento) === parseInt(compartimientoSelect)
      ) || null
    );
  };

  const formIsEditable = getDataAnalisisCompartimiento() ? false : true;

  useEffect(() => {
    if (!formIsEditable) {
      Object.keys(getDataAnalisisCompartimiento()).forEach((key) => {
        setValue(key, getDataAnalisisCompartimiento()[key]);
      });
    } else {
      FORM_FIELDS.forEach((field) => {
        setValue(field.name, "");
      });
      reset();
    }
  }, [formIsEditable]);

  const renderItem = ({ item, index }) => (
    <View style={styles.field} key={index}>
      <View style={[styles.field, styles.field_icon]}>
        <Icon size={15} name={item?.icon} />
        <Text style={styles.field_info}>{item.name.replaceAll("_", " ")}</Text>
      </View>
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => {
          if (item.type === "text") {
            return (
              <View style={styles.field_input}>
                <TextInput
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="numeric"
                  editable={formIsEditable}
                />
              </View>
            );
          } else if (item.type === "radio") {
            return (
              <View style={styles.radio_main}>
                {item.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      value === option?.name && styles.selectedOption,
                    ]}
                    onPress={() => onChange(option?.name)}
                    disabled={!formIsEditable}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        value === option?.name && styles.optionTextSelect,
                      ]}
                    >
                      {option?.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            );
          } else if (item.type === "textarea") {
            return (
              <View style={styles.field_input_area}>
                <TextInput
                  style={styles.input_area}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  editable={formIsEditable}
                />
              </View>
            );
          }
        }}
        name={item.name}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.info_navigation}>
          <View style={styles.info_main}>
            <View style={styles.info}>
              <Text h3 style={styles.info_ruta}>
                Analisis
              </Text>
            </View>
            <Text h4 style={styles.info_ruta}>{`Ruta: ${propData?.name}`}</Text>
            <Text style={styles.litros}>Litros: {propData?.litros}</Text>
            <Text h5 style={styles.date}>
              Fecha recolección:{" "}
              {getDataAnalisisCompartimiento()?.fecha || propData?.fecha}
            </Text>
            <Text h5 style={styles.date}>
              Fecha analisis:{" "}
              {getDataAnalisisCompartimiento()?.fecha_recoleccion || today}
            </Text>
            <Text h5 style={styles.date}>
              Compartimiento: {compartimientoSelect}
            </Text>
            <Text
              h5
              style={[
                styles.date,
                styles[getDataAnalisisCompartimiento()?.estado || "pendiente"],
              ]}
            >
              Estado: {getDataAnalisisCompartimiento()?.estado || "pendiente"}
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
              onPress={() => setCompartimientoSelect(index + 1)}
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
          <Card
            containerStyle={{
              borderRadius: 10,
            }}
          >
            {FORM_FIELDS.map((item, index) => renderItem({ item, index }))}
          </Card>
        </View>
        {!getDataAnalisisCompartimiento() && (
          <View style={styles.buttons_footer}>
            <Button
              title={"Aceptar"}
              containerStyle={styles.button_footer_container}
              buttonStyle={styles.button_footer}
              titleStyle={{ marginHorizontal: 5, fontSize: 16 }}
              color={"green"}
              disabled={loadingSave || !isValid}
              onPress={handleSubmit((data) => onSubmit(data, "aceptado"))}
            />
            <Button
              title={"Rechazar"}
              containerStyle={styles.button_footer_container}
              buttonStyle={styles.button_footer}
              titleStyle={{ marginHorizontal: 5, fontSize: 16 }}
              color={"#c90000"}
              disabled={loadingSave || !isValid}
              onPress={handleSubmit((data) => onSubmit(data, "rechazado"))}
            />
          </View>
        )}
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
    </SafeAreaView>
  );
};

export default Index;

import React, { useState } from "react";
import {
  View,
  Keyboard,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { Text, Divider, Card, Button } from "@rneui/themed";
import { Icon } from "react-native-elements";

import { SafeAreaView } from "react-native-safe-area-context";

import { useForm, Controller } from "react-hook-form";

import { useMyContext } from "../../../context";

import { styles } from "./styles";

import axios from "axios";

import moment from "moment";
import "moment/locale/es";

import { BASE_URL } from "../../constants";

const Index = ({ navigation, route }) => {
  moment.locale("es");
  const { user } = useMyContext();
  const { propData } = route.params;

  const formattedDateTime = moment(propData?.date.getTime()).format(
    "D [de] MMMM YYYY"
  );

   const [isError, setIsError] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [isModal, setIsModal] = useState(false)

  const today = moment().format("YYYY-MM-DD");

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();

  const onSubmit = async (data) => {
    setLoadingSave(true);
    setIsError(false);
    

    const body = {
      fecha: today,
      ruta: propData?.id,
      usuario: user?.id,
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
    };
    const url = await `${BASE_URL}/analisis/addAnalisis.php`;

    try {
      const response = await axios.post(url, body);
      if (response.status === 200) {
    
        setIsModal(true)
      }
    } catch (error) {
           setIsError(true);
      setIsModal(true)
    }

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
  ];

  const renderItem = ({ item }) => (
    <View style={styles.field}>
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
          }
        }}
        name={item.name}
      />
    </View>
  );

  const keyExtractor = (item, index) => `${item.name}_${index}`;

  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.info_navigation}>
        <View style={styles.info_main}>
          <View style={styles.info}>
            <Text h3 style={styles.info_ruta}>
              Analisis
            </Text>
          </View>
          <Text h4 style={styles.info_ruta}>{`Ruta: ${propData?.name}`}</Text>
          <Text h5 style={styles.date}>
            Fecha recolección: {formattedDateTime}
          </Text>
          <Text style={styles.litros}>Litros: {propData?.litros}</Text>
        </View>
        <Divider />
      </View>

      <View style={styles.card_view}>
        <Card
          containerStyle={{
            borderRadius: 10,
            
          }}
        >
          <FlatList
            data={FORM_FIELDS}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
          />
        </Card>
      </View>
      <Button
        title={loadingSave ? "Guardando..." : "Guardar"}
        containerStyle={{
          width: "100%",
          marginTop: 20,
          paddingHorizontal: 10,
        }}
        buttonStyle={{ height: 50, borderRadius: 10 }}
        titleStyle={{ marginHorizontal: 5, fontSize: 16 }}
        color={"green"}
        disabled={loadingSave || !isValid}
        onPress={handleSubmit(onSubmit)}
      />
      <Modal animationType="slide" transparent={true} visible={isModal}>
        <View style={styles.is_modal}>
        <View style={styles.modal_view}>
          <Text style={styles.modal_text} >{isError ?"! Error, intente de nuevo !" : "! Analisis guardado !"}  </Text>
          <Button
            title="Cerrar"
            onPress={() => {setIsModal(false);navigation.navigate("Home") }}
            buttonStyle={{ borderRadius: 10 }}
            titleStyle={{ paddingHorizontal: 10, fontSize: 14 }}
            color={"green"}
          />
        </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Index;

import React, { useEffect } from "react";
import { View, Keyboard, TextInput, TouchableOpacity } from "react-native";

import { useForm, Controller } from "react-hook-form";

import { Text, Button, Card } from "@rneui/themed";

import { Icon } from "react-native-elements";

import moment from "moment";

import { BASE_URL } from "../../constants";

import { styles } from "./styles";

function Form({
  analisisFormData,
  setIsError,
  setLoadingSave,
  propData,
  user,
  compartimientoSelect,
  setIsModal,
  loadingSave,
}) {
  const today = moment().format("YYYY-MM-DD");

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    reset,
  } = useForm();

  const onSubmit = async (data, status, toUpdated) => {
    setLoadingSave(true);
    setIsError(false);

    const body = {
      ...(toUpdated && { id: analisisFormData.analisis_id }),
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
      crioscopia: data.crioscopia,
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
    const urlPut = await `${BASE_URL}/analisis/updateAnalisis.php`;

    await fetch(toUpdated ? urlPut : url, {
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
        console.error("Error en las solicitudes:", error);
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
    { name: "ph", type: "text", icon: "device-hub" },
    { name: "densidad", type: "text", icon: "shower" },
    { name: "grasa", type: "text", icon: "oil-barrel" },
    { name: "proteina", type: "text", icon: "timeline" },
    { name: "crioscopia", type: "text", icon: "coronavirus" },
    { name: "solidos_no_grasos", type: "text", icon: "lens-blur" },
    { name: "solidos_totales", type: "text", icon: "lens-blur" },
    {
      name: "alcohol",
      type: "radio",
      icon: "science",
    },
    {
      name: "antibiotico",
      type: "radio",
      icon: "vaccines",
    },
    {
      name: "neutralizante",
      type: "radio",
      icon: "close-fullscreen",
    },
    {
      name: "cloruros",
      type: "radio",
      icon: "gas-meter",
    },
    {
      name: "peroxido",
      type: "radio",
      icon: "webhook",
    },
    {
      name: "peroxdata",
      type: "radio",
      icon: "all-out",
    },
    {
      name: "fosfadata",
      type: "radio",
      icon: "whatshot",
    },
    {
      name: "almidon",
      type: "radio",
      icon: "breakfast-dining",
    },
    {
      name: "prueba_suero",
      type: "radio",
      icon: "biotech",
    },
    {
      name: "observaciones",
      type: "textarea",
      icon: "sticky-note-2",
    },
  ];

  const formIsEditable = analisisFormData ? false : true;
  const isEditor = parseInt(user?.tipo) === 3 ? true : false;

  useEffect(() => {
    reset();
    if (!formIsEditable) {
      Object.keys(analisisFormData).forEach((key) => {
        setValue(key, analisisFormData[key], {
          shouldValidate: true,
        });
      });
    } else {
      FORM_FIELDS.forEach((field) => {
        setValue(field.name, "", { shouldValidate: true });
      });
    }
  }, [formIsEditable, analisisFormData, compartimientoSelect]);

  const renderItem = ({ item, index }) => (
    <View style={styles.field} key={index}>
      <View style={[styles.field, styles.field_icon]}>
        <Icon size={15} name={item?.icon} />
        <Text style={styles.field_info}>{item.name.replaceAll("_", " ")}</Text>
      </View>
      <Controller
        control={control}
        rules={{ required: item.type === "textarea" ? false : true }}
        render={({ field: { onChange, onBlur, value } }) => {
          if (item.type === "text" || item.type === "number") {
            return (
              <View style={styles.field_input}>
                <TextInput
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="text"
                  editable={formIsEditable || isEditor}
                />
              </View>
            );
          } else if (item.type === "radio") {
            return (
              <View style={styles.radio_main}>
                {positivo_negativo.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      value === option?.name && styles.selectedOption,
                    ]}
                    onPress={() => onChange(option?.name)}
                    disabled={!formIsEditable && !isEditor}
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
                  editable={formIsEditable || isEditor}
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
    <View>
      <Card
        containerStyle={{
          borderRadius: 10,
        }}
      >
        {FORM_FIELDS.map((item, index) => renderItem({ item, index }))}
      </Card>

      {!analisisFormData ? (
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
      ) : (
        isEditor && (
          <View style={styles.buttons_footer_update}>
            <Button
              title={"Actualizar"}
              containerStyle={styles.button_footer_container}
              buttonStyle={styles.button_footer}
              titleStyle={{ marginHorizontal: 5, fontSize: 16 }}
              color={"green"}
              disabled={loadingSave || !isValid}
              onPress={handleSubmit((data) =>
                onSubmit(data, analisisFormData.estado, true)
              )}
            />
          </View>
        )
      )}
    </View>
  );
}

export default Form;

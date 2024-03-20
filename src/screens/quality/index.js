import React, { useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TextInput,TouchableOpacity
} from "react-native";
import { Text, Divider, Input, Card, Button, Overlay } from "@rneui/themed";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMyContext } from "../../../context";
import SQLite from "react-native-sqlite-storage";
import { useForm, Controller } from "react-hook-form";

import { styles } from "./styles";

import moment from "moment";
import "moment/locale/es";

const Index = ({ navigation, route }) => {
  moment.locale("es");

  const { propData } = route.params;

  console.log("propData", propData);

  const formattedDateTime = moment(propData?.date.getTime()).format(
    "D [de] MMMM YYYY"
  );

  const [litros, setLitros] = useState(null);
  const [observaciones, setObservaciones] = useState(null);
  const [dialogMessage, setDialogMessage] = useState(false);
  const [dialogMessageError, setDialogMessageError] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const onSave = async () => {
    setLoadingSave(true);

    Keyboard.dismiss();
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });
  const onSubmit = (data) => console.log(data);

  const FORM_FIELDS = [
    { name: "temperatura" },
    { name: "acidez" },
    { name: "alcohol" },
    { name: "ph" },
    { name: "densidad" },
    { name: "grasa" },
    { name: "proteina" },
    { name: "ciloscopia" },
    { name: "antibiotico" },
    { name: "solidos_no_grasos" },
    { name: "solidos_totales" },
    { name: "neutralizante" },
    { name: "cloruros" },
    { name: "peroxido" },
    { name: "peroxdata" },
    { name: "fosfadata" },
    { name: "almidon" },
    { name: "prueba_suero" },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={10}>
        <View style={styles.content}>
          <View style={styles.info_navigation}>
            <View style={styles.info_main}>
              <View style={styles.info}>
                <Text
                  h3
                  style={styles.info_ruta}
                >{`Ruta: ${propData?.name}`}</Text>
              </View>
              <Text h5 style={styles.date}>
                Recogida: {formattedDateTime}
              </Text>
              <Text style={styles.litros}>Litros: {propData?.litros}</Text>
            </View>
            <Divider />
          </View>

          <Card>
            <View style={styles.form}>
              <View style={styles.field_main}>
                {FORM_FIELDS.map((field, index) => (
                  <View style={styles.field}>
                    <Text style={styles.field_info}>
                      {field.name.replaceAll("_", " ")}
                    </Text>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.field_input}>
                          <TextInput
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                          />
                          <TouchableOpacity
              style={[styles.optionButton, value === 'opcion1' && styles.selectedOption]}
              onPress={() => onChange('opcion1')}
            >
              <Text style={styles.optionText}>Opción 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, value === 'opcion2' && styles.selectedOption]}
              onPress={() => onChange('opcion2')}
            >
              <Text style={styles.optionText}>Opción 2</Text>
            </TouchableOpacity>
                        </View>
                      )}
                      name={field.name}
                    />
                  </View>
                ))}
              </View>

              <Button title="Submit" onPress={handleSubmit(onSubmit)} />
            </View>
          </Card>
        </View>
        <Button
          title={loadingSave ? "Guardando..." : "Guardar"}
          containerStyle={{
            width: "100%",
            marginTop: 20,
          }}
          buttonStyle={{ height: 50, borderRadius: 10 }}
          titleStyle={{ marginHorizontal: 5, fontSize: 20 }}
          color={"green"}
          disabled={!litros || loadingSave}
          onPress={() => onSave()}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Index;

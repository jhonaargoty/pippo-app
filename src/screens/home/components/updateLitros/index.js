import React, { useEffect, useState } from "react";
import { Text, Overlay, Button } from "@rneui/themed";
import { View, TextInput, ActivityIndicator } from "react-native";
import { BASE_URL } from "../../../../constants";
import axios from "axios";

import { styles } from "../../styles";

function UpdateLitros({
  visible,
  close,
  modalData,
  dateSelect,
  handleDateChange,
}) {
  const [loading, setLoading] = useState(null);
  const [saveOk, setSaveOk] = useState(null);

  const closeModal = () => {
    const closeModalFunction = () => {
      close();
    };

    setTimeout(closeModalFunction, 2000);
  };

  const updateLitros = async () => {
    setLoading(true);
    const url = await `${BASE_URL}/recolecciones_ruta/updateLitros.php`;

    const body = {
      item: {
        id: modalData?.id,
        litros: compartimientos.total,
        compartimiento1: compartimientos.compartimiento1 || 0,
        compartimiento2: compartimientos.compartimiento2 || 0,
        compartimiento3: compartimientos.compartimiento3 || 0,
      },
    };

    const response = await axios.post(url, body);
    if (response.status === 200) {
      setSaveOk(true);
      handleDateChange(dateSelect);
      setCompartimientos(defaultCompartimientos);
      closeModal();
    }
    setLoading(false);
  };

  const defaultCompartimientos = {
    compartimiento1: "",
    compartimiento2: "",
    compartimiento3: "",
    total: 0,
  };

  const [compartimientos, setCompartimientos] = useState(
    defaultCompartimientos
  );

  const fields = [
    { label: "C/miento 1:", key: "compartimiento1" },
    { label: "C/miento 2:", key: "compartimiento2" },
    { label: "C/miento 3:", key: "compartimiento3" },
    { label: "Total:", key: "total", disabled: true },
  ];

  const updateCompartimientos = (key, value) => {
    const updatedCompartimientos = {
      ...compartimientos,
      [key]: parseInt(value) || 0,
    };

    const total = Object.keys(updatedCompartimientos)
      .filter((compKey) => compKey !== "total")
      .reduce((acc, currKey) => acc + updatedCompartimientos[currKey], 0);

    updatedCompartimientos.total = total;

    setCompartimientos(updatedCompartimientos);
  };

  useEffect(() => {
    if (modalData) {
      setCompartimientos((prevState) => {
        const updatedCompartimientos = {
          ...prevState,
          compartimiento1: parseInt(modalData?.compartimiento1) || 0,
          compartimiento2: parseInt(modalData?.compartimiento2) || 0,
          compartimiento3: parseInt(modalData?.compartimiento3) || 0,
        };

        let total;

        if (modalData?.litros !== 0) {
          total = parseInt(modalData?.litros);
        } else {
          total = Object.keys(updatedCompartimientos)
            .filter((key) => key !== "total")
            .reduce((acc, key) => acc + updatedCompartimientos[key], 0);
        }

        updatedCompartimientos.total = total;

        return updatedCompartimientos;
      });
    }
  }, [modalData]);

  const isDataEqual = (data1, data2) => {
    return (
      parseInt(data1.compartimiento1) === parseInt(data2.compartimiento1) &&
      parseInt(data1.compartimiento2) === parseInt(data2.compartimiento2) &&
      parseInt(data1.compartimiento3) === parseInt(data2.compartimiento3)
    );
  };

  return (
    <Overlay
      isVisible={visible}
      overlayStyle={styles.modal_update}
      paddingHorizontal={0}
    >
      <View style={styles.modal_header}>
        <Text style={styles.modal_text_header}>{"Actualizar litros"}</Text>
        <Text style={styles.modal_text_header}>
          {"Ruta: "}
          {modalData?.name}
        </Text>
      </View>
      <View style={styles.modal_content}>
        {saveOk ? (
          <View style={styles.field}>
            <Text style={styles.field_label_ok}>Guardado correctamente</Text>
          </View>
        ) : (
          fields.map((field, index) => (
            <View style={styles.field} key={field?.label}>
              <Text style={styles.field_label}>{field?.label}</Text>
              <TextInput
                style={styles.input_update_litros}
                value={compartimientos[field.key].toString()}
                onChangeText={(text) => updateCompartimientos(field.key, text)}
                keyboardType="numeric"
                readOnly={field?.disabled}
              />
            </View>
          ))
        )}
      </View>
      <View style={styles.modal_buttons}>
        <Button
          title={"Cancelar"}
          buttonStyle={{
            borderRadius: 20,
            paddingHorizontal: 30,
            backgroundColor: "#c90000",
          }}
          onPress={() => {
            setCompartimientos(defaultCompartimientos);
            close();
          }}
        />
        <Button
          title={loading ? <ActivityIndicator color="#c90000" /> : "Guardar"}
          buttonStyle={{
            borderRadius: 20,
            paddingHorizontal: 30,
            backgroundColor: "#00c900",
          }}
          disabled={
            parseInt(compartimientos.total) === 0 ||
            loading ||
            isDataEqual(modalData, compartimientos)
          }
          onPress={() => {
            updateLitros();
          }}
        />
      </View>
    </Overlay>
  );
}

export default UpdateLitros;

import React, { useEffect, useState } from "react";

import { Text, Card, Button } from "@rneui/themed";
import { View, FlatList, ActivityIndicator } from "react-native";
import IconF1 from "react-native-vector-icons/FontAwesome";
import IconF from "react-native-vector-icons/FontAwesome5";
import { keyExtractor, renderItem } from "../../../utils";
import { Calendar } from "react-native-calendars";

import { useMyContext } from "../../../../context";
import moment from "moment";

import { styles } from "../styles";
import UpdateLitros from "./updateLitros";

function AnalisisRutas({ navigation }) {
  const {
    fetchRoutesByDate,
    recoleccionesByFecha,
    loadRecoleccionesByFecha,
    user,
  } = useMyContext();

  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (selectedDate) => {
    fetchRoutesByDate(selectedDate);
    setShowPicker(false);
    setDate(selectedDate);
  };

  useEffect(() => {
    handleDateChange(date);
  }, []);

  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalData, setModalData] = useState(null);

  return (
    <View style={styles.analisis_main}>
      <Card containerStyle={styles.card_standar}>
        <View style={styles.date_container}>
          <Button
            buttonStyle={styles.calendar_arrow}
            onPress={() => setShowPicker(!showPicker)}
          >
            <Text style={styles.title_date}>
              Seleccione fecha: {moment(date).format("D [de] MMMM YYYY")}
            </Text>
            <IconF name={showPicker ? "angle-up" : "angle-down"} size={20} />
          </Button>
          {showPicker && (
            <Calendar
              current={date}
              onDayPress={(day) => {
                handleDateChange(day.dateString);
                setShowPicker(false);
              }}
              markedDates={{
                [date]: { selected: true, selectedColor: "#c90000" },
              }}
              theme={{
                arrowColor: "#c90000",
                todayTextColor: "#c90000",
                monthTextColor: "#c90000",
              }}
              maxDate={moment().format("YYYY-MM-DD")}
            />
          )}
        </View>
      </Card>

      <Card containerStyle={[styles.card_standar, styles.flat_list]}>
        <View>
          {loadRecoleccionesByFecha ? (
            <View style={styles.not_data}>
              <ActivityIndicator size="small" color="#c90000" />
              <Text>Buscando recolecciones...</Text>
            </View>
          ) : recoleccionesByFecha?.length > 0 ? (
            <FlatList
              style={{ height: "auto" }}
              keyExtractor={keyExtractor}
              data={recoleccionesByFecha?.map((item) => {
                return {
                  ...item,
                  name: item?.ruta,
                  subtitle: `${item?.litros} Lt`,
                  subtitleStyle: styles.subtitle,
                  nameStyle: styles.ruta_title,
                };
              })}
              renderItem={({ item }) =>
                renderItem({
                  item,
                  onPress: () => {
                    if (parseInt(user?.tipo) === 4) {
                      setModalUpdate(true);
                      setModalData(item);
                    } else {
                      navigation.navigate("Quality", {
                        propData: {
                          ...item,
                        },
                      });
                    }
                  },
                })
              }
            />
          ) : (
            <View style={styles.not_data}>
              <IconF1 name="warning" size={15} />
              <Text>No hay recolecciones para este dia</Text>
            </View>
          )}
        </View>
      </Card>

      <UpdateLitros
        visible={modalUpdate}
        close={() => setModalUpdate(false)}
        modalData={modalData}
        dateSelect={date}
        handleDateChange={handleDateChange}
      />
    </View>
  );
}

export default AnalisisRutas;

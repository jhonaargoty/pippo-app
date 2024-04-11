import React, { useEffect, useState } from "react";

import { Text, Card, Button } from "@rneui/themed";
import { View, FlatList } from "react-native";
import IconF1 from "react-native-vector-icons/FontAwesome";
import IconF from "react-native-vector-icons/FontAwesome5";
import { keyExtractor, renderItem } from "../../../utils";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useMyContext } from "../../../../context";
import moment from "moment";

import { styles } from "../styles";

function AnalisisRutas({ navigation }) {
  const { fetchRoutesByDate, recoleccionesByFecha } = useMyContext();

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    fetchRoutesByDate(selectedDate);
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const showDatepicker = () => {
    setShowPicker(true);
  };

  useEffect(() => {
    handleDateChange(null, date);
  }, []);

  return (
    <>
      <Card containerStyle={styles.card_standar}>
        <View style={styles.date_container}>
          <Text style={styles.title_date}>
            Fecha recolección: {moment(date).format("D [de] MMMM YYYY")}
          </Text>
          <Button
            icon={<IconF name="angle-down" size={20} />}
            buttonStyle={{ backgroundColor: "transparent", padding: 0 }}
            onPress={() => showDatepicker()}
          />
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(e, date) => handleDateChange(e, date)}
              maximumDate={new Date()}
              locale="es"
            />
          )}
        </View>
      </Card>

      <Card containerStyle={styles.card_standar}>
        <View>
          {recoleccionesByFecha?.length > 0 ? (
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
                  onPress: () =>
                    navigation.navigate("Quality", {
                      propData: {
                        ...item,
                      },
                    }),
                })
              }
            />
          ) : (
            <View style={styles.not_data}>
              <IconF1 name="warning" size={25} />
              <Text>No hay recolecciones para este dia</Text>
            </View>
          )}
        </View>
      </Card>
    </>
  );
}

export default AnalisisRutas;

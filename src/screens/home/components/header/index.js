import React from "react";
import moment from "moment";
import IconF from "react-native-vector-icons/FontAwesome5";
import { View, ImageBackground, Image } from "react-native";
import { Text, Button } from "@rneui/themed";
import image from "../../../../assets/background.png";

import { useMyContext } from "../../../../../context";

import { fectDeletesession, borrarData } from "../../../../../context_const";

import { styles } from "../../styles";

function Index({ navigation }) {
  const { user, setUser } = useMyContext();

  const formattedDate = moment().format("dddd D [de] MMMM");
  const formattedTime = moment().format("HH:mm");

  return (
    <View style={styles.container_info}>
      <ImageBackground source={image}>
        <View style={styles.container_info_content}>
          <View style={styles.info}>
            <View>
              <Text h3 style={styles.text_header}>
                Hola,
              </Text>
              <View style={styles.user_off}>
                <Text h4 style={styles.text_header}>
                  {user?.nombre || user?.usuario}
                </Text>
                <Button
                  icon={<IconF name="power-off" size={15} color={"red"} />}
                  buttonStyle={styles.footer_icon}
                  onPress={() => {
                    fectDeletesession();
                    borrarData();
                    setUser(null);
                    navigation.navigate("Login");
                  }}
                />
              </View>
            </View>
            <View style={styles.info_icon_logos}>
              <Image
                style={styles.logo}
                source={require("../../../../assets/lola.png")}
              />
              <Image
                style={styles.logo_pippo}
                source={require("../../../../assets/logo_pipo.png")}
              />
            </View>
          </View>

          <View style={styles.date_placas}>
            <View style={styles.date_time}>
              <Text style={styles.date}>{formattedDate}</Text>
              <Text style={styles.date}>{formattedTime}</Text>
            </View>
            {parseInt(user?.tipo) === 1 && (
              <View style={styles.placas_main}>
                <Text style={styles.placas}>{user?.placa}</Text>
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

export default Index;

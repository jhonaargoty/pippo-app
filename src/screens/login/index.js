/* eslint-disable n/handle-callback-err */
/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Keyboard } from "react-native";
import { Button, Text, Input, LinearProgress } from "@rneui/themed";
import Icon from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import { usuariosLOCAL, conductoresLOCAL } from "../../utils/data";
import { BASE_URL } from "../../constants";
import { useMyContext } from "../../../context";
import SQLite from "react-native-sqlite-storage";

const Index = ({ navigation }) => {
  const [inUser, setInUser] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorLogin, setErrorlogin] = useState(null);

  const { setUser } = useMyContext();

  const [isConnected, setIsConnected] = useState(true);

  const verifyConnection = () => {
    NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
  };

  useEffect(() => {
    verifyConnection();
  }, []);

  let db = SQLite.openDatabase(
    {
      name: "pippo.db",
      location: "default",
    },
    () => {
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS session (id TEXT PRIMARY KEY, nombre TEXT, placa TEXT, ruta TEXT);",
          [],
          (tx, results) => {
            console.log("Table created successfully session");
          },
          (error) => {
            console.log(error.message);
          }
        );
      });
    },
    (error) => {
      console.log(error.message);
    }
  );

  const loginUser = (id, nombre, placa, ruta) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO session (id, nombre, placa, ruta) VALUES (?, ?, ?, ?);",
        [id, nombre, placa, ruta],
        (tx, results) => {
          console.log("Data inserted successfully session");
        },
        (error) => {
          console.log(error.message);
        }
      );
    });
  };

  const login = async () => {
    Keyboard.dismiss();
    const url = `${BASE_URL}/login/login.php`;
    setLoading(true);

    if (isConnected) {
      await axios
        .post(url, {
          user: inUser,
          password,
        })
        .then((response) => {
          if (response?.status === 200) {
            loginUser(
              response?.data?.id,
              response?.data?.nombre,
              response?.data?.placa,
              response?.data?.ruta
            );
            setUser(response?.data);
            navigation.navigate("Home");
          }
        })
        .catch((error) => {
          setErrorlogin(true);
        });
    } else {
      const usuarioTemp = usuariosLOCAL.find(
        (u) => u.usuario === inUser && u.password === password
      );
      const usuarioConductor = conductoresLOCAL.find(
        (c) => usuarioTemp?.id === c?.id
      );

      if (usuarioConductor) {
        loginUser(
          usuarioConductor?.id,
          usuarioConductor?.nombre,
          usuarioConductor?.placa,
          usuarioConductor?.ruta
        );
        setUser(usuarioConductor);
        navigation.navigate("Home");
      } else {
        setErrorlogin(true);
      }
    }

    setLoading(false);
  };

  return (
    <View style={styles.main}>
      <View style={styles.content}>
        <View>
          <View>
            <Image
              style={styles.logo}
              source={require("../../assets/logo_pipo.png")}
            />
          </View>
          <Text h1>Bienvenido</Text>
        </View>

        <View style={styles.inputs}>
          <View style={styles.inputs_content}>
            <Input
              style={styles.input}
              onChangeText={(e) => setInUser(e)}
              placeholder="Usuario"
              leftIcon={<Icon name="user-alt" size={20} />}
            
            />
          </View>
          <View style={styles.inputs_content}>
            <Input
              style={styles.input}
              onChangeText={(e) => setPassword(e)}
              placeholder="Contraseña"
              leftIcon={<Icon name="key" size={20} />}
              secureTextEntry={true}
              
            />
          </View>
          <View>
            {errorLogin && (
              <Text style={styles.error_login}>Datos incorrectos</Text>
            )}
          </View>
        </View>
        <View>
          <Button
            color={"red"}
            title="Iniciar sesion"
            icon={<Icon name="long-arrow-alt-right" color="white" size={20} />}
            size="lg"
            titleStyle={{ marginHorizontal: 7 }}
            buttonStyle={{
              backgroundColor: "#c90000",
              borderRadius: 100,
            }}
            disabled={!(password && inUser)}
            onPress={() => login()}
          />
        </View>
      </View>
      {loading && <LinearProgress style={styles.bottomView} color="red" />}
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 120,
    width: "100%",
    resizeMode: "contain",
  },
  error_login: {
    color: "red",
    marginHorizontal: "30%",
    width: "100%",
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  inputs: {
    marginVertical: 50,
    width: "80%",
  },
  inputs_content: {
    borderWidth: 1,
    borderRadius: 100,
    height: 50,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  bottomView: {
    alignSelf: "flex-end",
    height: 5,
  },
});

export default Index;

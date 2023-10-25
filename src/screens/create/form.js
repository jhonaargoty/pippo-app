import React, { useState, useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Divider, Input, Card, Button, Overlay } from '@rneui/themed';
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useMyContext } from '../../../context';

import { saveData } from '../../utils';
import { BASE_URL } from '../../constants';

import NetInfo from '@react-native-community/netinfo';

import moment from 'moment';
import 'moment/locale/es';

const Index = ({ navigation, route }) => {
  const { rutaActual, user, fetchDataRecolecciones } = useMyContext();

  moment.locale('es');
  const { fetchData } = route.params || {};
  const { propData } = route.params;

  const formattedDateTime = moment().format('dddd D [de] MMMM : HH:mm');

  const [litros, setLitros] = useState(null);
  const [observaciones, setObservaciones] = useState(null);
  const [dialogMessage, setDialogMessage] = useState(false);

  const [isConnected, setIsConnected] = useState(true);

  const verifyConnection = () => {
    NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
  };

  useEffect(() => {
    verifyConnection();
  }, []);

  const onSave = async () => {
    const item = {
      litros,
      observaciones,
      fecha: moment().format('YYYY-MM-DD'),
      ganadero: propData?.id,
      conductor: user?.id,
      ruta: rutaActual?.id,
    };

    const url = `${BASE_URL}/recolecciones/addRecoleccion.php`;

    if (isConnected) {
      try {
        setDialogMessage(true);
        const response = await axios.post(url, { item });
        console.log(response.data);
      } catch (error) {
        setDialogMessage(true);
        console.error('Error:', error);
        console.error('Response data:', error.response.data);
      }
    } else {
      if (formCache) {
        const oldData = formCache;

        const save = await saveData(
          'form',
          JSON.stringify({
            ...oldData,
            ['item-' + (Object.keys(oldData).length + 1)]: item,
          }),
        );

        save === 'SUCCESS' && setDialogMessage(true);
      } else {
        const save = await saveData('form', JSON.stringify({ 'item-1': item }));
        save === 'SUCCESS' && setDialogMessage(true);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={10}>
        <View style={styles.content}>
          <View style={styles.info_navigation}>
            {/*   <Button
              icon={<Icon name="arrow-back" />}
              type="clear"
              buttonStyle={{ margin: 0 }}
              onPress={() => navigation.navigate("Create")}
            />
 */}
            <View style={styles.info_main}>
              <View style={styles.info}>
                <Icon name="local-shipping" color="#c90000" />
                <Text
                  h3
                  style={styles.info_ruta}
                >{`Ruta: ${rutaActual?.nombre}`}</Text>
              </View>
              <Text h5 style={styles.date}>
                {formattedDateTime}
              </Text>
            </View>
            <Divider />
          </View>

          <View style={styles.info_ganadero}>
            <Text h4>{propData.name}</Text>
            <Text h5>Nit: {propData.documento}</Text>
            <Text h5>Promedio: {propData.promedio} lts</Text>
          </View>
          <Card
            containerStyle={{
              borderRadius: 10,
              margin: 0,
              paddingHorizontal: 30,
              paddingVertical: 20,
            }}
          >
            <View style={styles.labels}>
              <Icon name="local-drink" size={20} />
              <Text h5>Litros</Text>
            </View>
            <View style={styles.inputs_content}>
              <Input
                style={styles.input}
                keyboardType="numeric"
                onChangeText={(e) => setLitros(e)}
                inputContainerStyle={
                  Platform.OS === 'android' && { borderBottomWidth: 0 }
                }
              />
            </View>

            <View style={styles.labels}>
              <Icon name="description" size={20} />
              <Text h5>Observaciones</Text>
            </View>
            <View style={styles.inputs_content}>
              <Input
                onChangeText={(e) => setObservaciones(e)}
                inputContainerStyle={
                  Platform.OS === 'android' && { borderBottomWidth: 0 }
                }
              />
            </View>
          </Card>
          <Overlay isVisible={dialogMessage} overlayStyle={styles.dialog}>
            <View style={styles.dialog_content}>
              <Icon name="check-circle" size={40} color={'green'} />
              <Text h4>Registro guardado</Text>

              <View style={styles.buttons}>
                <Button
                  title={'Imprimir'}
                  buttonStyle={{ borderRadius: 20, paddingHorizontal: 30 }}
                  onPress={() =>
                    navigation.navigate('Print', {
                      item: {
                        litros,
                        observaciones,
                        fecha: moment().format('YYYY-MM-DD HH:mm:ss'),
                        ganadero: propData.id,
                        conductor: 1,
                        ruta: rutaActual,
                      },
                      fetchData,
                    })
                  }
                />
                <Button
                  title={'Salir'}
                  buttonStyle={{
                    backgroundColor: 'rgba(214, 61, 57, 1)',
                    borderRadius: 20,
                    paddingHorizontal: 30,
                  }}
                  onPress={() => {
                    navigation.navigate('Home');
                    fetchDataRecolecciones();
                  }}
                />
              </View>
            </View>
          </Overlay>
        </View>
        <Button
          title={'Guardar'}
          containerStyle={{
            width: '100%',
            marginTop: 20,
          }}
          buttonStyle={{ height: 50, borderRadius: 10 }}
          titleStyle={{ marginHorizontal: 5, fontSize: 20 }}
          color={'green'}
          disabled={!litros}
          onPress={() => onSave()}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  dialog_content: {
    alignItems: 'center',
    flexDirection: 'column',
    gap: 20,
  },
  dialog: {
    padding: 50,
    width: '80%',
  },
  info_navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    /* marginRight: 50, */
  },
  labels: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  content: {
    gap: 20,
  },
  input: {
    fontSize: 25,
    textAlign: 'center',
  },
  inputs_content: {
    borderWidth: 0.4,
    borderRadius: 15,
    height: 40,
    marginBottom: 20,
  },
  info_ganadero: {
    flexDirection: 'column',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  info_main: {
    alignItems: 'center',
    marginBottom: 5,
    width: '100%',
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
    height: '100%',
  },
  date: { textTransform: 'capitalize' },
  info_ruta: { textTransform: 'capitalize' },
});

export default Index;

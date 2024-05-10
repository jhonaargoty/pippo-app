import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Button } from "@rneui/themed";
import Geolocation from "react-native-geolocation-service";
import * as geolib from "geolib";

const App = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    /* Geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    ); */
    /* Geolocation.getCurrentPosition(
      position => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    ); */
  }, []);

  const [location, setLocation] = useState(false);

  const getLocation = () => {
    console.log("getLocation");
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        setLocation(position);
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
        setLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );

    console.log(location);
  };

  /*  const referenceCoords = { latitude: 4.6769875, longitude: -74.1510843 };
  const distance = userLocation
    ? geolib?.getDistance(userLocation, referenceCoords)
    : null; */

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button onPress={() => getLocation()} />

      {/* {userLocation ? (
        <Text>
          Rango de ubicación de la finca {distance} metros !Recoleccion
          aprobada!
        </Text>
      ) : (
        <Text>Obteniendo ubicación...</Text>
      )} */}
    </View>
  );
};

export default App;

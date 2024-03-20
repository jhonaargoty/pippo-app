import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import * as geolib from 'geolib';


const App = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  

  const referenceCoords = {"latitude": 4.6769875, "longitude": -74.1510843}; 
  const distance = userLocation
    ? geolib?.getDistance(userLocation, referenceCoords)
    : null;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {userLocation ? (
        <Text>
          Rango de ubicación de la finca {distance} metros
          !Recoleccion aprobada!
        </Text>
      ) : (
        <Text>Obteniendo ubicación...</Text>
      )}
    </View>
  );
};

export default App;

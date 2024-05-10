/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import moment from "moment-timezone";
import { BASE_URL } from "./src/constants";
import Geolocation from "react-native-geolocation-service";
import { PermissionsAndroid } from "react-native";
import {
  fetchSaveGanaderos,
  fetchGetGanaderos,
  fectGetRecolecciones,
  fetchGetConductores,
  fetchSaveConductores,
  fetchSaveRutas,
  fetchGetRutas,
  fetchSaveRutaActual,
  fetchGetRutaActual,
  fetchGetUSer,
  fetchSaveRutaActiva,
  fetchGetRutaActiva,
  fectDeleteRecolecciones,
  createDBRutaActiva,
} from "./context_const";

const MyContext = createContext();

export const useMyContext = () => {
  return useContext(MyContext);
};

const MyContextProvider = ({ children }) => {
  moment.locale("es");
  const [user, setUser] = useState(null);
  const [listConductores, setListConductores] = useState([]);
  const [listGanaderos, setListGanaderos] = useState([]);
  const [listRutas, setListRutas] = useState([]);
  const [listRecoleccionesLOCAL, setListRecoleccionesLOCAL] = useState([]);
  const [rutaActual, setRutaActual] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [rutaActiva, setRutaActiva] = useState(null);
  const [sync, setSync] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [gpsUser, setGPSUser] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [isGPSEnabled, setIsGPSEnabled] = useState(false);

  useEffect(() => {
    if (parseInt(user?.tipo) === 1) {
      const checkPermissionsAndGPS = async () => {
        const permission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        setHasLocationPermission(permission);

        Geolocation.getCurrentPosition(
          () => setIsGPSEnabled(true),
          () => setIsGPSEnabled(false)
        );
      };

      checkPermissionsAndGPS();

      const intervalId = setInterval(() => {
        checkPermissionsAndGPS();
      }, 2000);

      return () => {
        clearInterval(intervalId);
      };
    } else {
      setIsGPSEnabled(true);
      setHasLocationPermission(true);
    }
  }, [user?.tipo]);

  useEffect(() => {
    const getLocation = async () => {
      const permission = true;
      setHasLocationPermission(permission);
      if (permission) {
        Geolocation.getCurrentPosition(
          (position) => {
            setGPSUser({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.log(error.code, error.message);
            setGPSUser(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    };

    const intervalId = setInterval(() => {
      getLocation();
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const verifyConnection = () => {
    NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
  };

  const fetchData = async () => {
    setSyncLoading(true);
    try {
      const conductoresResponse = await axios.get(
        `${BASE_URL}/conductores/getListConductores.php`
      );
      await fetchSaveConductores(conductoresResponse.data);
      setListConductores(conductoresResponse.data);

      const ganaderosResponse = await axios.get(
        `${BASE_URL}/ganaderos/getListGanaderos.php`
      );
      await fetchSaveGanaderos(ganaderosResponse.data);
      setListGanaderos(ganaderosResponse.data);

      const rutasResponse = await axios.get(
        `${BASE_URL}/rutas/getListRutas.php`
      );

      await fetchSaveRutas(rutasResponse.data);
      setListRutas(rutasResponse.data);

      setSync(true);
      setSyncMessage("!Datos sincronizados!");
    } catch (error) {
      setSync(true);
      setSyncMessage("Error, intente de nuevo");
      console.error("Error en las solicitudes:", error);
    }
    setSyncLoading(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      verifyConnection();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkLogin = () => {
      fetchGetUSer(setUser);
    };

    checkLogin();
  }, []);

  useEffect(() => {
    if (user && parseInt(user?.tipo) === 1) {
      const loadData = async () => {
        await fetchGetConductores(setListConductores);
        await fetchGetGanaderos(setListGanaderos);
        await fetchGetRutas(setListRutas);
      };

      loadData();
      createDBRutaActiva();
      fetchGetRutaActiva(setRutaActiva);
      fectGetRecolecciones(setListRecoleccionesLOCAL);
    } else if (user && parseInt(user?.tipo) === 2) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (listRutas?.length && user) {
      const rs = listRutas.find((r) => parseInt(r.id) === parseInt(user?.ruta));

      fetchSaveRutaActual(rs);
      setRutaActual(rs);
    }
  }, [user, listRutas]);

  const [recoleccionesCreadas, setRecoleccionesCreadas] = useState({});

  const crearRecoleccion = async () => {
    const url = await `${BASE_URL}/recolecciones/addRecoleccionAll.php`;

    try {
      const response = await axios.post(url, listRecoleccionesLOCAL);
      if (response.status === 200) {
        fetchSaveRutaActiva(false);
        setRutaActiva(false);
        setRecoleccionesCreadas({ type: "success" });
      } else {
        setRecoleccionesCreadas(false);
      }
    } catch (error) {
      setRecoleccionesCreadas({ type: "error" });
      console.error("Error en las solicitudes:", error);
    }
  };

  const [recoleccionesByFecha, setRecoleccionesByFecha] = useState([]);
  const [loadRecoleccionesByFecha, setLoadRecoleccionesByFecha] =
    useState(false);

  const fetchRoutesByDate = async (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setLoadRecoleccionesByFecha(true);
    try {
      const recolecciones = await axios.get(
        `${BASE_URL}recolecciones_ruta/getRecoleccionesRutaByDate.php?fecha=${formattedDate}`
      );
      setRecoleccionesByFecha(recolecciones.data);
    } catch (error) {
      setSync(true);
      setSyncMessage("Error, intente de nuevo");
      console.error("Error en las solicitudes:", error);
    }
    setLoadRecoleccionesByFecha(false);
  };

  return (
    <MyContext.Provider
      value={{
        listConductores,
        listGanaderos,
        listRutas,
        user,
        setUser,
        setRutaActual,
        rutaActual,
        isConnected,
        crearRecoleccion,
        listRecoleccionesLOCAL,
        setListRecoleccionesLOCAL,
        rutaActiva,
        setRutaActiva,
        fetchData,
        sync,
        setSync,
        syncMessage,
        syncLoading,
        fetchRoutesByDate,
        recoleccionesByFecha,
        gpsUser,
        recoleccionesCreadas,
        setRecoleccionesCreadas,
        hasLocationPermission,
        isGPSEnabled,
        loadRecoleccionesByFecha,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyContextProvider;

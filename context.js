/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import moment from "moment-timezone";
import { BASE_URL } from "./src/constants";
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
  }, [isConnected]);

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        await fetchGetConductores(setListConductores);
        await fetchGetGanaderos(setListGanaderos);
        await fetchGetRutas(setListRutas);
      };

      loadData();
      createDBRutaActiva();
      fetchGetRutaActiva(setRutaActiva);
      fectGetRecolecciones(setListRecoleccionesLOCAL);
    }
  }, [user]);

  useEffect(() => {
    if (listRutas?.length && user) {
      const rs = listRutas.find((r) => parseInt(r.id) === parseInt(user?.ruta));

      fetchSaveRutaActual(rs);
      setRutaActual(rs);
    }
  }, [user, listRutas, isConnected]);

  const crearRecoleccion = async () => {
    const url = await `${BASE_URL}/recolecciones/addRecoleccionAll.php`;

    try {
      const response = await axios.post(url, listRecoleccionesLOCAL);
      if (response.status === 200) {
        fetchSaveRutaActiva(false);
        setRutaActiva(false);
      }
    } catch (error) {}
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
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyContextProvider;

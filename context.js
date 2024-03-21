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

  /* useEffect(() => {
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
  }, [user]); */

  /*  useEffect(() => {
    if (listRutas?.length && user) {
      const rs = listRutas.find((r) => parseInt(r.id) === parseInt(user?.ruta));

      fetchSaveRutaActual(rs);
      setRutaActual(rs);
    }
  }, [user, listRutas, isConnected]); */

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

  const [recoleccionesByFecha, setRecoleccionesByFecha] = useState([]);

  const fetchRoutesByDate = async (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");

    try {
      const recolecciones = await axios.get(
        `${BASE_URL}recolecciones/getRecoleccionesByFecha.php?fechaIni=${formattedDate}&fechaFin=${formattedDate}`
      );
      const formatData = obtenerInformacionRutas(recolecciones.data);
      setRecoleccionesByFecha(formatData);
    } catch (error) {
      setSync(true);
      setSyncMessage("Error, intente de nuevo");
      console.error("Error en las solicitudes:", error);
    }
  };

  function obtenerInformacionRutas(datos) {
    const rutas = {};

    datos.forEach((dato) => {
      const { ruta, ruta_id, conductor, conductor_id, litros } = dato;

      if (!rutas[ruta]) {
        rutas[ruta] = { ruta_id, litros: parseInt(litros) };
      } else {
        rutas[ruta].litros += parseInt(litros);
      }

      if (!rutas[ruta].conductores) {
        rutas[ruta].conductores = [];
      }

      if (
        !rutas[ruta].conductores.some((c) => c.conductor_id === conductor_id)
      ) {
        rutas[ruta].conductores.push({ conductor, conductor_id });
      }
    });

    const rutasConDosConductores = Object.entries(rutas)
      .filter(([_, info]) => info.conductores && info.conductores.length === 2)
      .map(([ruta, info]) => {
        const conductores = info.conductores.map((c) => ({
          conductor: c.conductor,
          conductor_id: c.conductor_id,
        }));
        return {
          ruta,
          ruta_id: info.ruta_id,
          litros: info.litros,
          conductores,
        };
      });

    rutasConDosConductores.forEach((ruta) => delete rutas[ruta.ruta]);

    const resultado = Object.entries(rutas).map(([ruta, info]) => ({
      ruta,
      ruta_id: info.ruta_id,
      litros: info.litros,
      conductores: info.conductores
        ? info.conductores.map((c) => ({
            conductor: c.conductor,
            conductor_id: c.conductor_id,
          }))
        : undefined,
    }));

    resultado.push(...rutasConDosConductores);

    return resultado;
  }

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
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyContextProvider;

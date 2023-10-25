/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import { getData, saveData } from "./src/utils";
import moment from "moment";

import { BASE_URL } from "./src/constants";

const MyContext = createContext();

export const useMyContext = () => {
  return useContext(MyContext);
};

const MyContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [listConductores, setListConductores] = useState([]);
  const [listGanaderos, setListGanaderos] = useState([]);
  const [listRutas, setListRutas] = useState([]);
  const [listRecolecciones, setListRecolecciones] = useState([]);
  const [rutaActual, setRutaActual] = useState(null);
  const [isConnected, setIsConnected] = useState(true);

  const verifyConnection = () => {
    NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
  };

  const momentDate = moment();
  const formattedDate = momentDate.format("YYYY-MM-DD");

  const fetchDataRecolecciones = async () => {
    const recoleccionesResponse = await axios.get(
      `${BASE_URL}/recolecciones/getRecoleccionesByConductor.php?fecha=${formattedDate}&conductor=${user?.id}&ruta=${rutaActual?.id}`
    );

    setListRecolecciones(recoleccionesResponse.data);
    saveData("listRecolecciones", recoleccionesResponse?.data);
  };
  const fetchData = async () => {
    try {
      const conductoresResponse = await axios.get(
        `${BASE_URL}/conductores/getListConductores.php`
      );
      setListConductores(conductoresResponse.data);
      saveData("listConductores", conductoresResponse?.data);

      const ganaderosResponse = await axios.get(
        `${BASE_URL}/ganaderos/getListGanaderos.php`
      );
      setListGanaderos(ganaderosResponse.data);
      saveData("listGanaderos", ganaderosResponse?.data);

      const rutasResponse = await axios.get(
        `${BASE_URL}/rutas/getListRutas.php`
      );
      setListRutas(rutasResponse.data);
      saveData("listRutas", rutasResponse?.data);
    } catch (error) {
      console.error("Error en las solicitudes:", error);
    }
  };

  useEffect(() => {
    if (user && rutaActual) {
      fetchDataRecolecciones();
    }
  }, [rutaActual]);

  useEffect(() => {
    if (listRutas.length) {
      const rs = listRutas.find((r) => r.id === user?.ruta);
      setRutaActual(rs);
      saveData("routeSelected", rs);
    }
  }, [user, listRutas]);

  /*   console.log("aqui-.--1listRoutes", listRoutes);
  console.log("aqui-.--routeSelected", routeSelected);*/
  console.log("aqui-.--user", user);

  useEffect(() => {
    const loadUser = async () => {
      setUser(await getData("user"));
    };

    verifyConnection();
    if (isConnected) {
      fetchData();
    } else {
      // Cargar datos desde el almacenamiento local si no estás conectado
      const loadData = async () => {
        //  setConductoresList(await getData("conductores"));
        // setGanaderos(await getData("ganaderos"));
        //  setListRoutes(await getData("rutas"));
        // const user = ganaderos.find((c) => c.id === userLoggued.id);
        /*  setUserLoggued(user); */
      };

      loadData();
    }
    loadUser();
  }, [isConnected]);

  return (
    <MyContext.Provider
      value={{
        listConductores,
        listGanaderos,
        listRutas,
        listRecolecciones,
        user,
        setUser,
        setRutaActual,
        rutaActual,
        fetchDataRecolecciones,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyContextProvider;

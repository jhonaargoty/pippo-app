/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import { getData, saveData } from "./src/utils";
import moment from "moment-timezone";
import { BASE_URL } from "./src/constants";
import { conductoresLOCAL, ganaderosLOCAL, rutasLOCAL } from "./src/utils/data";

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
  const [isConnected, setIsConnected] = useState(null);
  const [currentDate, setCurrentDate] = useState(moment().tz("America/Bogota"));
  const [rutaActiva, setRutaActiva] = useState(
    getData("rutaActiva") === "false" ? false : true
  );

  console.log("currentDate", currentDate);
  console.log("rutaActiva", rutaActiva);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment().tz("America/Bogota");

      console.log("now", now.format("LLL"));
      if (!now.isSame(currentDate, "day")) {
        setCurrentDate(now);
        setRutaActiva(true);
        saveData("rutaActiva", "true");
        console.log("¡Cambiaste de día!");
      } else {
        console.log("¡No cambiaste de día!");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentDate]);

  const verifyConnection = () => {
    NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
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
    if (listRutas.length && user) {
      const rs = listRutas.find((r) => r.id === user?.ruta);
      setRutaActual(rs);
      saveData("routeSelected", rs);
    }
  }, [user, listRutas]);

  useEffect(() => {
    verifyConnection();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      setUser(await getData("user"));
    };
    loadUser();
  }, [isConnected]);

  useEffect(() => {
    if (user) {
      if (isConnected) {
        fetchData();
      } else {
        const loadData = async () => {
          const conductoresStore = await getData("listConductores");

          if (conductoresStore) {
            setListConductores(conductoresStore);
          } else {
            setListConductores(conductoresLOCAL);
          }

          const ganaderosStore = await getData("listGanaderos");

          if (ganaderosStore) {
            setListGanaderos(ganaderosStore);
          } else {
            setListGanaderos(ganaderosLOCAL);
          }

          const rutasStore = await getData("listRutas");

          if (rutasStore) {
            setListRutas(rutasStore);
          } else {
            setListRutas(rutasLOCAL);
          }

          const recoleccionesLOCALStore = await getData(
            "listRecoleccionesLOCAL"
          );

          if (recoleccionesLOCALStore) {
            setListRecoleccionesLOCAL(recoleccionesLOCALStore);
          }
        };

        loadData();
      }
    }
  }, [isConnected, user]);

  useEffect(() => {
    if (listRecoleccionesLOCAL?.length > 0) {
      saveData("listRecoleccionesLOCAL", listRecoleccionesLOCAL);
    }
  }, [listRecoleccionesLOCAL]);

  const crearRecoleccion = async () => {
    const url = await `${BASE_URL}/recolecciones/addRecoleccionAll.php`;
    try {
      const response = await axios.post(url, listRecoleccionesLOCAL);
      if (response.status === 200) {
        setRutaActiva(false);
        saveData("rutaActiva", "false");
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
        setListConductores,
        setListGanaderos,
        setListRutas,
        setListRecoleccionesLOCAL,
        setRutaActual,
        crearRecoleccion,
        listRecoleccionesLOCAL,
        rutaActiva,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyContextProvider;

/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import { getData, removeData, saveData } from "./src/utils";
import moment from "moment-timezone";
import { BASE_URL } from "./src/constants";
import SQLite from "react-native-sqlite-storage";
import {
  fetchSaveGanaderos,
  fetchGetGanaderos,
  fectGetRecolecciones,
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
  const [isConnected, setIsConnected] = useState(null);
  const [currentDate, setCurrentDate] = useState(moment().tz("America/Bogota"));
  const [rutaActiva, setRutaActiva] = useState(
    /* getData("rutaActiva") === "false" ? false : */ true
  );

  let db = SQLite.openDatabase({
    name: "pippo.db",
    location: "default",
  });

  /* useEffect(() => {
    const interval = setInterval(() => {
      const now = moment().tz("America/Bogota");

      if (!now.isSame(currentDate, "day")) {
        setCurrentDate(now);
        setRutaActiva(true);
        saveData("rutaActiva", "true");
        setListRecoleccionesLOCAL([]);
        removeData("listRecoleccionesLOCAL");
        console.log("¡Cambiaste de día!");
      } else {
        console.log("¡No cambiaste de día!");
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [currentDate]); */

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
      /*    saveData("listConductores", conductoresResponse?.data); */

      const ganaderosResponse = await axios.get(
        `${BASE_URL}/ganaderos/getListGanaderos.php`
      );
      await fetchSaveGanaderos(ganaderosResponse.data);
      setListGanaderos(ganaderosResponse.data);

      const rutasResponse = await axios.get(
        `${BASE_URL}/rutas/getListRutas.php`
      );
      setListRutas(rutasResponse.data);
      /*  saveData("listRutas", rutasResponse?.data); */
    } catch (error) {
      console.error("Error en las solicitudes:", error);
    }
  };

  /* useEffect(() => {
    if (listRutas.length && user) {
      const rs = listRutas.find((r) => r.id === user?.ruta);
      setRutaActual(rs);
      saveData("routeSelected", rs);
    }
  }, [user, listRutas]); */

  useEffect(() => {
    verifyConnection();
  }, []);

  useEffect(() => {
    const checkLogin = () => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM session;",
          [],
          (tx, results) => {
            let len = results.rows.length;
            if (len > 0) {
              let row = results.rows.item(0);
              console.log(`User ${row?.nombre} is logged in`);
              setUser(row);
            } else {
              console.log("No user is logged in");
            }
          },
          (error) => {
            console.log(error.message);
          }
        );
      });
    };

    checkLogin();
  }, [isConnected]);

  useEffect(() => {
    if (user) {
      if (isConnected) {
        fetchData();
      } else {
        const loadData = async () => {
          /*  const conductoresStore = await getData("listConductores");
          setListConductores(conductoresStore); */

          await fetchGetGanaderos(setListGanaderos);

          /* const ganaderosStore = await getData("listGanaderos");
          setListGanaderos(ganaderosStore); */

          const rutasStore = await getData("listRutas");
          setListRutas(rutasStore);
        };

        loadData();
      }

      fectGetRecolecciones(setListRecoleccionesLOCAL);
    }
  }, [isConnected, user]);

  const crearRecoleccion = async () => {
    const url = await `${BASE_URL}/recolecciones/addRecoleccionAll.php`;
    try {
      const response = await axios.post(url, listRecoleccionesLOCAL);
      if (response.status === 200) {
        setRutaActiva(false);
        /*   saveData("rutaActiva", "false"); */
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
        /*   setListGanaderos, */
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

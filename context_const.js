import SQLite from "react-native-sqlite-storage";
//npx expo run:android
//eas build -p android --profile preview
let db = SQLite.openDatabase({
  name: "pippo.db",
  location: "default",
});

export const fetchGetRutaActiva = async (setRutaActiva) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM rutaActiva;",
      [],
      (tx, results) => {
        let len = results.rows.length;
        if (len > 0) {
          setRutaActiva(true);
        } else {
          setRutaActiva(false);
          console.log("No hay ruta activa");
        }
      },
      (error) => {
        console.log(error.message);
      }
    );
  });
};

export const createDBRutaActiva = async (activa) => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS rutaActiva (id INTEGER PRIMARY KEY, activa BOOL);",
      []
    );
    /* tx.executeSql(
      "DELETE FROM rutaActiva",
      [],
      (tx, results) => {
        console.log("Resultados", results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log("Se han eliminado todos los datos de la tabla.");
        } else {
          console.log("No se encontraron datos para eliminar.");
        }
      },
      (error) => {
        console.log("Error al eliminar los datos", error);
      }
    ); */
  });
};

export const fetchSaveRutaActiva = async (activa) => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS rutaActiva (id INTEGER PRIMARY KEY, activa BOOL);",
      []
    );
    tx.executeSql("DELETE FROM rutaActiva", [], (tx, results) => {});
    tx.executeSql(
      "INSERT OR IGNORE INTO rutaActiva (id, activa) VALUES (?, ?)",
      [0, activa]
    );
  });
};

export const fetchGetUSer = async (setUser) => {
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

export const fetchSaveRutaActual = async (ruta) => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS rutaActual (id INTEGER PRIMARY KEY, nombre TEXT, direccion TEXT);",
      []
    );
    tx.executeSql("DELETE FROM rutaActual", [], (tx, results) => {});
    tx.executeSql(
      "INSERT OR IGNORE INTO rutaActual (id, nombre, direccion) VALUES (?, ?, ?)",
      [ruta?.id, ruta?.nombre, ruta?.direccion]
    );
  });
};

export const fetchGetRutaActual = (setRutaActual) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS rutaActual (id INTEGER PRIMARY KEY, nombre TEXT, direccion TEXT);",
        []
      );
      tx.executeSql(
        "SELECT * FROM rutaActual;",
        [],
        (tx, results) => {
          let len = results.rows.length;
          if (len > 0) {
            let data = [];
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              data.push(row);
            }
            setRutaActual(data[0]);
            resolve(data);
          } else {
            resolve(false);
          }
        },
        (error) => {
          console.log(error.message);
          reject(error);
        }
      );
    });
  });
};

export const fetchSaveRutas = async (rutas) => {
  rutas?.forEach((item) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS rutas (id INTEGER PRIMARY KEY, nombre TEXT, direccion TEXT);",
        []
      );
      tx.executeSql(
        "INSERT OR IGNORE INTO rutas (id, nombre, direccion) VALUES (?, ?, ?)",
        [item?.id, item?.nombre, item?.direccion]
      );
    });
  });
};
export const fetchGetRutas = async (setListRutas) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM rutas;",
      [],
      (tx, results) => {
        let len = results.rows.length;
        if (len > 0) {
          let data = [];
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            data.push(row);
          }
          setListRutas(data);
        } else {
          console.log("No data found rutas");
        }
      },
      (error) => {
        console.log(error.message);
      }
    );
  });
};

export const fetchSaveConductores = async (conductores) => {
  conductores?.forEach((item) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS conductores (id INTEGER PRIMARY KEY, nombre TEXT, placa TEXT, ruta TEXT, rutas TEXT);",
        []
      );
      tx.executeSql(
        "INSERT OR IGNORE INTO conductores (id, nombre, placa, ruta, rutas) VALUES (?, ?, ?, ?, ?)",
        [item?.id, item?.nombre, item?.placa, item?.ruta, item?.rutas]
      );
    });
  });
};

export const fetchGetConductores = async (setListConductores) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM conductores;",
      [],
      (tx, results) => {
        let len = results.rows.length;
        if (len > 0) {
          let data = [];
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            data.push(row);
          }
          setListConductores(data);
        } else {
          console.log("No data found conductores");
        }
      },
      (error) => {
        console.log(error.message);
      }
    );
  });
};

export const fetchSaveGanaderos = async (ganaderos) => {
  ganaderos?.forEach((item) => {
    db.transaction((tx) => {
      /*  tx.executeSql(
        "DROP TABLE IF EXISTS ganaderos;",
        [],
        (tx, results) => {
          console.log("Tabla ganaderos eliminada con éxito");
        },
        (error) => {
          console.log(error.message);
        }
      ); */
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS ganaderos (id INTEGER PRIMARY KEY, direccion TEXT, documento TEXT, nombre TEXT, orden TEXT, precio TEXT, promedio TEXT, ruta TEXT, ruta_nombre TEXT, telefono TEXT);",
        []
      );
      tx.executeSql(
        "INSERT OR IGNORE INTO ganaderos (id, direccion, documento, nombre, orden, precio, promedio, ruta, ruta_nombre, telefono) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          item?.id,
          item?.direccion,
          item?.documento,
          item?.nombre,
          item?.orden,
          item?.precio,
          item?.promedio,
          item?.ruta,
          item?.ruta_nombre,
          item?.telefono,
        ]
      );
    });
  });
};

export const fetchGetGanaderos = async (setListGanaderos) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM ganaderos;",
      [],
      (tx, results) => {
        let len = results.rows.length;
        if (len > 0) {
          let data = [];
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            data.push(row);
          }
          setListGanaderos(data);
        } else {
          console.log("No data found ganaderos");
        }
      },
      (error) => {
        console.log(error.message);
      }
    );
  });
};

export const fectGetRecolecciones = async (setListRecoleccionesLOCAL) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM recolecciones;",
      [],
      (tx, results) => {
        let len = results.rows.length;
        if (len > 0) {
          let data = [];
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            data.push(row);
          }
          /*  console.log("data recolecciones", data); */
          setListRecoleccionesLOCAL(data);
        } else {
          console.log("No data found recolecciones");
        }
      },
      (error) => {
        console.log(error.message);
      }
    );
  });
};

export const fectDeleteRecolecciones = async (setListRecoleccionesLOCAL) => {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM recolecciones",
      [],
      (tx, results) => {
        console.log("Resultados", results.rowsAffected);
        if (results.rowsAffected > 0) {
          setListRecoleccionesLOCAL([]);
        } else {
          console.log("No se encontraron datos para eliminar.");
        }
      },
      (error) => {
        console.log("Error al eliminar los datos", error);
      }
    );
  });
};
export const fectDeleteGanaderos = async (setListRecoleccionesLOCAL) => {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM ganaderos",
      [],
      (tx, results) => {
        console.log("Resultados", results.rowsAffected);
        if (results.rowsAffected > 0) {
          setListRecoleccionesLOCAL([]);
        } else {
          console.log("No se encontraron datos para eliminar.");
        }
      },
      (error) => {
        console.log("Error al eliminar los datos", error);
      }
    );
  });
};
export const fectDeletesession = async (setListRecoleccionesLOCAL) => {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM session",
      [],
      (tx, results) => {
        console.log("Resultados", results.rowsAffected);
        if (results.rowsAffected > 0) {
          setListRecoleccionesLOCAL([]);
        } else {
          console.log("No se encontraron datos para eliminar.");
        }
      },
      (error) => {
        console.log("Error al eliminar los datos", error);
      }
    );
  });
};

/* db.transaction((tx) => {
  tx.executeSql(
    "DELETE FROM nombreDeLaTabla",
    [],
    (tx, results) => {
      console.log("Resultados", results.rowsAffected);
      if (results.rowsAffected > 0) {
        console.log("Se han eliminado todos los datos de la tabla.");
      } else {
        console.log("No se encontraron datos para eliminar.");
      }
    },
    (error) => {
      console.log("Error al eliminar los datos", error);
    }
  );
}); */

import SQLite from "react-native-sqlite-storage";

let db = SQLite.openDatabase({
  name: "pippo.db",
  location: "default",
});

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
        [],
        (tx, results) => {
          console.log("Tabl ganaderos created successfully");
        },
        (error) => {
          console.log(error.message);
        }
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
        ],
        (tx, results) => {
          console.log("Datos insertados con éxito ganaderos");
        },
        (error) => {
          console.log(error.message);
        }
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

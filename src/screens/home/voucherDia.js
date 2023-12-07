import ThermalPrinterModule from "react-native-thermal-printer";

const imprimir = async ({ lista, user, fecha, ganaderos, litrosTotales }) => {
  try {
    let receiptContent = "";
    receiptContent += "[C]       Alimentos Pippo SAS\n";
    receiptContent += "[C]       Parque Agroindustrial\n";
    receiptContent += "[C]       Buenos Aires\n";
    receiptContent += "[C]       Guasca - Cundinamarca\n";
    receiptContent += "[C]       gerencia@alimentospippo.com\n";
    receiptContent += "----------------------\n";
    receiptContent += `[C]Recolectado por: ${user?.nombre}\n`;
    receiptContent += `[C]Placas: ${user?.placa}\n\n\n`;
    receiptContent += `[C]Fecha: ${fecha}\n`;
    receiptContent += "\n";
    receiptContent += "----------------------\n";
    receiptContent += `[C]Ganadero                     Litros\n`;
    for (const detalle of lista || []) {
      receiptContent += `[C]${ganaderos
        .find((g) => g.id === detalle?.ganadero)
        ?.nombre?.substring(0, 26)}     ${detalle?.litros}\n`;
    }
    receiptContent += "----------------------\n";
    receiptContent += `[C]TOTAL: ${litrosTotales}\n`;

    await ThermalPrinterModule.printBluetooth({
      payload: receiptContent,
      printerNbrCharactersPerLine: 1,
    });
  } catch (err) {
    //error handling
    console.log("-----", err.message);
  }
};

const sumarLitros = (arrayRecolecciones) => {
  const sumaTotal = arrayRecolecciones.reduce((total, recoleccion) => {
    const litros = parseFloat(recoleccion.litros) || 0;
    return total + litros;
  }, 0);

  return sumaTotal;
};

export const imprimirVoucherDia = async (props) => {
  const litrosTotales = sumarLitros(props.lista);

  await imprimir({ ...props, litrosTotales });
};

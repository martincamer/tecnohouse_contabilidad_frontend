import { PDFViewer } from "@react-pdf/renderer";
import { ImprimirEstadisticaPdf } from "./ImprirmirEstadisticaPdf";
import { useIngresosContext } from "../../context/IngresosProvider";
import { usePresupuestosContext } from "../../context/PresupuestosProvider";

// import { ImprimirPdf } from "./ImprirmirPdf";

export const ViewPdfPruebasDos = () => {
  const { ingresoMensual } = useIngresosContext();
  const { presupuestoMensual } = usePresupuestosContext();

  const formatoMoneda = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Obtener la fecha actual
  const fechaActual = new Date();

  const diaDeLaSemana = fechaActual.getDay();

  // Obtener el día del mes
  const diaDelMes = fechaActual.getDate();

  // Obtener el mes (0 para enero, 1 para febrero, ..., 11 para diciembre)
  const mes = fechaActual.getMonth();

  // Obtener el año
  const ano = fechaActual.getFullYear();

  // Días de la semana en español
  const diasSemana = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];

  // Meses en español
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  // Formatear la fecha
  const fechaFormateada = `${diasSemana[diaDeLaSemana]}_${meses[mes]}_${diaDelMes}_${ano}`;

  const totalSum = presupuestoMensual.reduce((accumulator, currentValue) => {
    return accumulator + parseFloat(currentValue.total);
  }, 0);

  const totalSumDos = ingresoMensual.reduce((accumulator, currentValue) => {
    return accumulator + parseFloat(currentValue.total);
  }, 0);

  // Calcular el total usado por cada arreglo
  const totalPresupuestoMensual = presupuestoMensual.reduce(
    (acc, item) => acc + parseFloat(item.total),
    0
  );
  const totalIngresoMensual = ingresoMensual.reduce(
    (acc, item) => acc + parseFloat(item.total),
    0
  );

  // Calcular el porcentaje del total usado por cada tipo en ingresoMensual
  const porcentajePorTipoIngreso = {};
  ingresoMensual.forEach((item) => {
    const tipo = item.tipo;
    const total = parseFloat(item.total);
    if (!porcentajePorTipoIngreso[tipo]) {
      porcentajePorTipoIngreso[tipo] = (total / totalIngresoMensual) * 100;
    } else {
      porcentajePorTipoIngreso[tipo] += (total / totalIngresoMensual) * 100;
    }
  });

  // Calcular el porcentaje del total usado por cada tipo en presupuestoMensual
  const porcentajePorTipoPresupuesto = {};
  presupuestoMensual.forEach((item) => {
    const tipo = item.tipo;
    const total = parseFloat(item.total);
    if (!porcentajePorTipoPresupuesto[tipo]) {
      porcentajePorTipoPresupuesto[tipo] =
        (total / totalPresupuestoMensual) * 100;
    } else {
      porcentajePorTipoPresupuesto[tipo] +=
        (total / totalPresupuestoMensual) * 100;
    }
  });

  // Agregar las propiedades de porcentaje al arreglo original ingresoMensual
  const ingresoMensualConPorcentaje = ingresoMensual.map((item) => ({
    ...item,
    porcentajeUsado: porcentajePorTipoIngreso[item.tipo],
  }));

  // Agregar las propiedades de porcentaje al arreglo original presupuestoMensual
  const presupuestoMensualConPorcentaje = presupuestoMensual.map((item) => ({
    ...item,
    porcentajeUsado: porcentajePorTipoPresupuesto[item.tipo],
  }));

  // Obtener el total de presupuesto para cada tipo en presupuestoMensual
  const presupuestoMensualTotales = presupuestoMensual.reduce((acc, item) => {
    acc[item.tipo] = parseFloat(item.total);
    return acc;
  }, {});

  // Calcular la diferencia entre el presupuesto y el ingreso para cada tipo
  const diferenciaPorTipo = ingresoMensual.map((item) => ({
    tipo: item.tipo,
    diferencia: presupuestoMensualTotales[item.tipo]
      ? presupuestoMensualTotales[item.tipo] - parseFloat(item.total)
      : 0,
  }));

  const downloadDataAsExcel = () => {
    // Prepare data for Excel
    const data = ingresoMensualConPorcentaje.map((item, index) => ({
      TIPO: item.tipo.toUpperCase(),
      "Total egresos": new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(item.total),
      "% egresos": `${(item.porcentajeUsado || 0).toFixed(2)}%`,
      "Total Presupuesto Estimado": new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(presupuestoMensualConPorcentaje[index]?.total || 0),
      "% Presupuesto":
        (presupuestoMensualConPorcentaje[index]?.porcentajeUsado || 0).toFixed(
          2
        ) + "%",
      "Diferencia Presupuesto/Egresos": new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(diferenciaPorTipo[index]?.diferencia || 0),
    }));

    // Create worksheet and workbook
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos");

    // Save the file
    XLSX.writeFile(wb, "datos.xlsx");
  };

  const ingresoMensualOrdenado = [...ingresoMensualConPorcentaje].sort(
    (a, b) => {
      if (a.tipo < b.tipo) return -1;
      if (a.tipo > b.tipo) return 1;
      return 0;
    }
  );
  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <ImprimirEstadisticaPdf
        totalSum={totalSum}
        totalSumDos={totalSumDos}
        ingresoMensualConPorcentaje={ingresoMensualConPorcentaje}
        presupuestoMensualConPorcentaje={presupuestoMensualConPorcentaje}
        diferenciaPorTipo={diferenciaPorTipo}
      />
    </PDFViewer>
  );
};

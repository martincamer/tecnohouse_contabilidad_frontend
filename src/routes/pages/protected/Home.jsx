import { ChartComponent } from "../../../components/home/ChartComponent";
import { ChartComponentTwo } from "../../../components/home/ChartComponentColumn";
import { ChartComponentColumnTwo } from "../../../components/home/ChartComponentColumnTwo";
import { ChartComponentTree } from "../../../components/home/ChartComponentTree";
import { DatosComponent } from "../../../components/home/DatosComponent";
import { FechaComponent } from "../../../components/home/FechaComponent";
import { useIngresosContext } from "../../../context/IngresosProvider";
import { usePresupuestosContext } from "../../../context/PresupuestosProvider";

export const Home = () => {
  const fechaActual = new Date();
  const numeroMesActual = fechaActual.getMonth() + 1; // Se suma 1 porque los meses en JavaScript van de 0 a 11

  const nombresMeses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const nombreMesActual = nombresMeses[numeroMesActual - 1];

  const { presupuestoMensual } = usePresupuestosContext();

  const totalPresupuesto = presupuestoMensual.reduce(
    (accumulator, currentValue) => {
      return accumulator + parseInt(currentValue.total);
    },
    0
  );

  const { ingresoMensual } = useIngresosContext();

  // Convertir la propiedad 'total' de string a número usando map
  const ingresosNumericos = ingresoMensual.map((item) => ({
    ...item,
    total: Number(item.total),
  }));

  // Sumar los totales
  const totalIngreso = ingresosNumericos.reduce(
    (acumulador, ingreso) => acumulador + ingreso.total,
    0
  );

  // Consolidar ingresos por tipo y sumar los totales
  const ingresosConsolidados = ingresoMensual.reduce((consolidado, ingreso) => {
    if (!consolidado[ingreso.tipo]) {
      consolidado[ingreso.tipo] = {
        tipo: ingreso.tipo,
        total: 0,
      };
    }
    consolidado[ingreso.tipo].total += parseInt(ingreso.total, 10);
    return consolidado;
  }, {});

  const totalGlobal = Object.values(ingresosConsolidados).reduce(
    (total, ingreso) => total + ingreso.total,
    0
  );

  // Distribuir el total global en porcentajes
  // const porcentajeDistribucion = 0.4; // 40%
  const ingresosDistribuidos = Object.values(ingresosConsolidados).map(
    (ingreso) => ({
      ...ingreso,
      porcentaje: ingreso.total / totalGlobal /** porcentajeDistribucion*/,
    })
  );

  // Calculamos los ingresos por tipo
  const ingresosPorTipo = ingresoMensual.reduce((acumulador, ingreso) => {
    const tipo = ingreso.tipo;
    const total = parseInt(ingreso.total, 10);

    if (!acumulador[tipo]) {
      acumulador[tipo] = 0;
    }

    acumulador[tipo] += total;

    return acumulador;
  }, {});

  // Calculamos el total de ingresos mensuales
  const ingresoMensualTotal = Object.values(ingresosPorTipo).reduce(
    (total, tipoTotal) => {
      return total + tipoTotal;
    },
    0
  );

  const presupuestoMensualTotal = presupuestoMensual.reduce(
    (total, presupuesto) => total + parseInt(presupuesto.total, 10),
    0
  );

  // Calculamos la diferencia por tipo
  const diferenciaPorTipo = Object.entries(ingresosPorTipo).map(
    ([tipo, totalIngresoTipo]) => {
      const totalPresupuestoTipo =
        (totalIngresoTipo / ingresoMensualTotal) * presupuestoMensualTotal;
      const diferencia = totalPresupuestoTipo - totalIngresoTipo;

      return { tipo, diferencia };
    }
  );

  console.log("Diferencia por tipo:", diferenciaPorTipo);

  const formatoMoneda = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const datosFormateados = ingresosDistribuidos.map((item, index) => ({
    tipo: capitalize(item.tipo),
    total: item.total,
    porcentaje: item.porcentaje * 100, // Mantenlo como número
    diferencia: diferenciaPorTipo[index].diferencia,
  }));

  return (
    <section className="w-full h-full py-12 px-12 max-md:px-4 flex flex-col gap-20">
      <div className="grid grid-cols-5 gap-4 border-[1px] shadow-md rounded py-5 px-10">
        <DatosComponent
          icono={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
              />
            </svg>
          }
          title="Total cargados"
          total={ingresoMensual.length}
        />
        <DatosComponent
          icono={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
              />
            </svg>
          }
          title="Total final"
          total={Number(totalIngreso).toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })}
        />
        <FechaComponent
          icono={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
              />
            </svg>
          }
        />
        <DatosComponent
          title="Total del presupuesto"
          total={Number(totalPresupuesto).toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })}
          icono={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
              />
            </svg>
          }
        />
        <DatosComponent
          icono={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
              />
            </svg>
          }
          title="Total Gastos"
          total={Number(totalIngreso).toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })}
        />
      </div>
      <div className="bg-slate-100/50 rounded-lg py-10 px-3 border-slate-300 border-[1px]">
        <ChartComponent />
      </div>{" "}
      <div className="flex gap-5 bg-slate-100/50 rounded-lg py-10 px-3 border-slate-300 border-[1px]">
        <ChartComponentTwo datosFormateados={datosFormateados} />
        <ChartComponentTree />
      </div>
      <div className=" bg-slate-100/50 rounded-lg py-10 px-3 border-slate-300 border-[1px]">
        <ChartComponentColumnTwo datosFormateados={datosFormateados} />
      </div>
    </section>
  );
};

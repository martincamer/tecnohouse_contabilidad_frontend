import { useIngresosContext } from "../../../context/IngresosProvider";
import { Link } from "react-router-dom";
import { usePresupuestosContext } from "../../../context/PresupuestosProvider";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { ImprimirEstadisticaPdf } from "../../../components/pdf/ImprirmirEstadisticaPdf";
import { PDFDownloadLink } from "@react-pdf/renderer";

export const Estadistica = () => {
  const { setIngresoMensual, ingresoMensual } = useIngresosContext();
  const { presupuestoMensual } = usePresupuestosContext();

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

  return (
    <section className="px-10 py-16 w-full h-full flex flex-col gap-5">
      <Link
        to={"/"}
        className="absolute flex top-4 text-sm font-bold text-indigo-500 gap-2 items-center"
      >
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
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        VOLVER
      </Link>

      <div className=" bg-slate-100 border-slate-300 border-[1px] shadow rounded-lg grid grid-cols-3">
        <div className="border-r-[1px] border-slate-300 py-5 px-5 flex flex-col gap-1 items-center justify-center">
          <p className="text-slate-600 text-sm">Total generado</p>
          <p className="text-indigo-600">
            {totalGlobal.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </p>
        </div>

        <div className="border-r-[1px] border-slate-300 py-5 px-5 flex flex-col gap-1 items-center justify-center">
          <p className="text-slate-600 text-sm">Total ingresos distribuidos</p>
          <p className="text-indigo-600">{ingresosDistribuidos.length}</p>
        </div>

        <div className=" py-5 px-5 flex flex-col gap-1 items-center justify-center">
          <p className="text-slate-600 text-sm">Presupuesto estimado</p>
          <p className="text-indigo-600">
            {presupuestoMensual.map((p) =>
              Number(p.total).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })
            )}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex gap-5 items-center">
          <p className="text-lg uppercase border-b-[2|px] border-indigo-500 text-indigo-600">
            Ingresos distrubuidos porcentaje
          </p>

          <div>
            <PDFDownloadLink
              fileName={`estadistica_${fechaFormateada}`}
              document={
                <ImprimirEstadisticaPdf
                  presupuestoMensual={presupuestoMensual}
                  ingresoMensual={ingresosDistribuidos}
                  diferenciaPorTipo={diferenciaPorTipo}
                />
              }
            >
              <button className="text-sm bg-indigo-500/10 border-indigo-500 border-[1px] text-indigo-600 py-2 px-4 shadow rounded-lg">
                Descargar estadistica mensual
              </button>
            </PDFDownloadLink>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 mt-5">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="text-left">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold capitalize">
                  Tipo
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold capitalize">
                  Total
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold capitalize">
                  Porcentaje usado
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold capitalize">
                  Diferencia presupuesto estimado
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 text-left">
              {ingresosDistribuidos.map((item, index) => (
                <tr
                  className="hover:bg-slate-200 cursor-pointer transition-all ease-in-out duration-100"
                  key={item.tipo}
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 capitalize">
                    {item.tipo}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    }).format(item.total)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                    {`${(item.porcentaje * 100).toFixed(2)}%`}
                  </td>

                  <td
                    className={`whitespace-nowrap px-4 py-3 text-gray-700 ${
                      diferenciaPorTipo[index].diferencia < 0
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    }).format(diferenciaPorTipo[index].diferencia)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-100/30 rounded-lg border-[1px] border-slate-300 shadow py-10 px-10 mt-10">
        <BarChart
          width={1220}
          height={500}
          className="w-full mx-auto"
          data={datosFormateados}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tipo" />
          <Tooltip
            formatter={(value, name) =>
              name === "Porcentaje usado"
                ? `${Number(value).toFixed(2)}%`
                : formatoMoneda.format(Number(value))
            }
          />
          <Legend />

          <Bar dataKey="total" name="Total" fill="#6366f1" />
          <Bar
            dataKey="porcentaje"
            name="Porcentaje usado"
            fill="#82ca9d"
            label={{
              formatter: (valor) => `${Number(valor).toFixed(2)}%`,
              position: "top",
            }}
          />
          <Bar
            dataKey="diferencia"
            name="Diferencia presupuesto estimado"
            fill="#f87171"
          />
        </BarChart>
      </div>
    </section>
  );
};

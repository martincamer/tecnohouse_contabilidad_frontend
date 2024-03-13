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
import * as XLSX from "xlsx";

export const Estadistica = () => {
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

  console.log("ingresoMensual con porcentaje:", ingresoMensualConPorcentaje);
  console.log(
    "presupuestoMensual con porcentaje:",
    presupuestoMensualConPorcentaje
  );

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

      <div className=" bg-white border-slate-300 border-[1px] shadow rounded-xl grid grid-cols-3">
        <div className="border-r-[1px] border-slate-300 py-5 px-5 flex flex-col gap-1 items-center justify-center">
          <p className="text-slate-600 text-sm">Total en egresos generados</p>
          <p className="text-indigo-600">
            {Number(totalSumDos).toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </p>
        </div>

        <div className="border-r-[1px] border-slate-300 py-5 px-5 flex flex-col gap-1 items-center justify-center">
          <p className="text-slate-600 text-sm">
            Total en egresos distribuidos
          </p>
          <p className="text-indigo-600">{ingresoMensual.length}</p>
        </div>

        <div className=" py-5 px-5 flex flex-col gap-1 items-center justify-center">
          <p className="text-slate-600 text-sm">
            Presupuesto de egresos estimado
          </p>
          <p className="text-indigo-600">
            {Number(totalSum).toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex gap-5 items-center">
          <p className="text-lg uppercase border-b-[2|px] border-indigo-500 text-indigo-600">
            Egresos distribuidos porcentajes/etc
          </p>

          <div>
            <PDFDownloadLink
              fileName={`estadistica_${fechaFormateada}`}
              document={
                <ImprimirEstadisticaPdf
                  totalSum={totalSum}
                  totalSumDos={totalSumDos}
                  ingresoMensualConPorcentaje={ingresoMensualConPorcentaje}
                  presupuestoMensualConPorcentaje={
                    presupuestoMensualConPorcentaje
                  }
                  diferenciaPorTipo={diferenciaPorTipo}
                />
              }
            >
              {({ blob, url, loading, error }) =>
                loading ? (
                  <span>Loading...</span>
                ) : (
                  <button className="text-sm bg-indigo-500/10 border-indigo-500 border-[1px] text-indigo-600 py-2 px-4 shadow rounded-lg">
                    Descargar estadistica mensual
                  </button>
                )
              }
            </PDFDownloadLink>
          </div>
        </div>

        <button
          onClick={downloadDataAsExcel}
          type="button"
          className="bg-green-500 text-white py-2 px-4 mt-4 rounded-xl shadow"
        >
          Descargar estadistica en formato excel
        </button>

        <div className="overflow-x-auto rounded-lg border border-gray-200 mt-5">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="text-left">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold uppercase">
                  Tipo
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold uppercase">
                  Total egresos
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold uppercase">
                  % egresos
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold uppercase">
                  Total Presupuesto Estimado
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold uppercase">
                  % Presupuesto
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold uppercase">
                  Diferencia Presupuesto/Egresos
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 text-left">
              {ingresoMensualConPorcentaje.map((item, index) => (
                <tr
                  className="hover:bg-slate-200 cursor-pointer transition-all ease-in-out duration-100"
                  key={item.tipo}
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 capitalize">
                    {item.tipo}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-green-600 font-bold">
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    }).format(item.total)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                    {`${(item.porcentajeUsado || 0).toFixed(2)}%`}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700 font-bold">
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    }).format(
                      presupuestoMensualConPorcentaje[index]?.total || 0
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                    {presupuestoMensualConPorcentaje[
                      index
                    ]?.porcentajeUsado.toFixed(2) || 0}
                    %
                  </td>
                  <td
                    className={`whitespace-nowrap px-4 py-3 text-gray-700 font-bold ${
                      diferenciaPorTipo[index]?.diferencia < 0
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    }).format(diferenciaPorTipo[index]?.diferencia || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border-[1px] border-slate-300 shadow py-10 px-10 mt-10">
        <BarChart
          width={1220}
          height={500}
          className="w-full mx-auto"
          data={ingresoMensualConPorcentaje}
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

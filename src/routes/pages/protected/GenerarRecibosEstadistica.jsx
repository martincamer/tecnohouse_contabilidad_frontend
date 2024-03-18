import client from "../../../api/axios";
import { SyncLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { PDFDownloadLink } from "@react-pdf/renderer";
import * as XLSX from "xlsx";
import { ImprimirEstadisticaPdf } from "../../../components/pdf/ImprirmirEstadisticaPdf";

export const GenerarRecibosEstadistica = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [datos, setDatos] = useState([]);

  const [loading, setLoading] = useState(false);

  const obtenerIngresoRangoFechas = async (fechaInicio, fechaFin) => {
    try {
      setLoading(true);

      // Validación de fechas
      if (!fechaInicio || !fechaFin) {
        console.error("Fechas no proporcionadas");
        return;
      }

      // Verifica y formatea las fechas
      fechaInicio = new Date(fechaInicio).toISOString().split("T")[0];
      fechaFin = new Date(fechaFin).toISOString().split("T")[0];

      const response = await client.post("/ingresos/rango-fechas", {
        fechaInicio,
        fechaFin,
      });

      setDatos(response.data); // Maneja la respuesta según tus necesidades
    } catch (error) {
      console.error("Error al obtener ingresos:", error);
      // Maneja el error según tus necesidades
    } finally {
      // Establece el estado de loading a false después de 1500 milisegundos (1.5 segundos)
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  const buscarIngresosPorFecha = () => {
    obtenerIngresoRangoFechas(fechaInicio, fechaFin);
  };

  const [mes, setMes] = useState("");

  const [presupuesto, setPresupuesto] = useState([]);

  const obtenerPresupuestoPorMes = async (mes) => {
    try {
      // Validación del mes
      if (!mes) {
        console.error("Mes no proporcionado");
        return;
      }

      const response = await client.get(`/presupuesto/mes/${mes}`);

      setPresupuesto(response.data); // Maneja la respuesta según tus necesidades
    } catch (error) {
      console.error("Error al obtener presupuestos:", error);
      // Maneja el error según tus necesidades
    }
  };

  const buscarPresupuestoPorMes = () => {
    obtenerPresupuestoPorMes(mes);
  };

  const totalSum = presupuesto.reduce((accumulator, currentValue) => {
    return accumulator + parseFloat(currentValue.total);
  }, 0);

  const totalSumDos = datos.reduce((accumulator, currentValue) => {
    return accumulator + parseFloat(currentValue.total);
  }, 0);

  // Calcular el total usado por cada arreglo
  const totalPresupuestoMensual = presupuesto.reduce(
    (acc, item) => acc + parseFloat(item.total),
    0
  );
  const totalIngresoMensual = datos.reduce(
    (acc, item) => acc + parseFloat(item.total),
    0
  );

  // Calcular el porcentaje del total usado por cada tipo en ingresoMensual
  const porcentajePorTipoIngreso = {};
  presupuesto.forEach((item) => {
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
  presupuesto.forEach((item) => {
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
  const ingresoMensualConPorcentaje = datos.map((item) => ({
    ...item,
    porcentajeUsado: porcentajePorTipoIngreso[item.tipo],
  }));

  // Agregar las propiedades de porcentaje al arreglo original presupuestoMensual
  const presupuestoMensualConPorcentaje = presupuesto.map((item) => ({
    ...item,
    porcentajeUsado: porcentajePorTipoPresupuesto[item.tipo],
  }));

  // Obtener el total de presupuesto para cada tipo en presupuestoMensual
  const presupuestoMensualTotales = presupuesto.reduce((acc, item) => {
    acc[item.tipo] = parseFloat(item.total);
    return acc;
  }, {});

  // Calcular la diferencia entre el presupuesto y el ingreso para cada tipo
  const diferenciaPorTipo = datos.map((item) => ({
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
      <div className="flex">
        <p className="text-slate-700 text-base border-b-[3px] border-indigo-500">
          Buscar estadisticas de mes a mes.
        </p>
      </div>
      <div className="mt-10">
        <div className="flex gap-6 items-center">
          <div className="flex gap-2 items-center">
            <label className="text-sm text-indigo-500">Fecha de inicio</label>
            <input
              className="text-sm bg-slate-100 py-1 px-2 rounded-lg shadow border-slate-300 border-[1px] cursor-pointer text-slate-700 outline-none"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm text-indigo-500">Fecha de fin</label>
            <input
              className="text-sm bg-slate-100 py-1 px-2 rounded-lg shadow border-slate-300 border-[1px] cursor-pointer text-slate-700 outline-none"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>

          <button
            onClick={buscarIngresosPorFecha}
            className="bg-indigo-500/10 text-sm border-[1px] border-indigo-500 text-indigo-700 px-2 py-1 rounded-md shadow"
          >
            Buscar estadistica
          </button>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <label className="text-sm text-indigo-500">Mes</label>
        <input
          className="text-sm bg-slate-100 py-1 px-2 rounded-lg shadow border-slate-300 border-[1px] cursor-pointer text-slate-700 outline-none"
          type="text"
          placeholder="Escribe el numero del mes"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
        />

        <button
          className="bg-indigo-500/10 text-sm border-[1px] border-indigo-500 text-indigo-700 px-2 py-1 rounded-md shadow"
          onClick={buscarPresupuestoPorMes}
        >
          Buscar Presupuesto
        </button>
      </div>

      <div className="mb-10 flex gap-5 items-center">
        <div>
          <button
            className="bg-slate-700 text-white py-2 px-5 rounded-lg text-sm flex gap-2 items-center"
            type="button"
          >
            <PDFDownloadLink
              fileName={`estadistica`}
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
                  <button className="text-sm">
                    Descargar estadistica mensual formato PDF
                  </button>
                )
              }
            </PDFDownloadLink>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex gap-5">
        <div className="text-sm text-slate-700 font-normal flex gap-3 items-center">
          Total del presupuesto Asignado{" "}
          <span className="text-indigo-500 text-sm font-semibold">
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(totalSumDos)}
          </span>
        </div>
        -
        <div className="text-sm text-slate-700 font-normal flex gap-3 items-center">
          Total de los egresos generados{" "}
          <span className="text-indigo-500 text-sm font-semibold">
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(totalSum)}
          </span>
        </div>
      </div>

      <div>
        <button
          onClick={downloadDataAsExcel}
          className="bg-green-500 text-white py-2 px-5 rounded-xl text-sm flex gap-2 items-center"
          type="button"
        >
          Descargar en formato excel
        </button>
      </div>

      <div className="h-screen">
        {loading ? (
          <div className="flex gap-3 mt-20 justify-center h-full">
            <SyncLoader color="#4A90E2" size={6} margin={6} />{" "}
            <p className="animate-blink text-slate-700 text-sm">
              Buscando los datos...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 mt-5">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
              <thead className="text-left">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold uppercase">
                    Tipo
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold uppercase">
                    Total Presupuesto Estimado
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold uppercase">
                    % Presupuesto
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold uppercase">
                    Total egresos
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold uppercase">
                    % egresos
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold uppercase">
                    Diferencia Presupuesto/Egresos
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-left">
                {ingresoMensualOrdenado.map((item, index) => {
                  if (item.tipo.toLowerCase().startsWith("canje")) {
                    // Si el tipo comienza con "canje", no mostrar la fila
                    return null;
                  }

                  // Buscar el objeto correspondiente en presupuestoMensualConPorcentaje y diferenciaPorTipo
                  const presupuestoItem = presupuestoMensualConPorcentaje.find(
                    (presupuesto) => presupuesto.tipo === item.tipo
                  );

                  const diferenciaItem = diferenciaPorTipo.find(
                    (diferencia) => diferencia.tipo === item.tipo
                  );

                  return (
                    <tr
                      className="hover:bg-slate-200 cursor-pointer transition-all ease-in-out duration-100"
                      key={item.tipo}
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 capitalize">
                        {item.tipo}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-700 font-bold">
                        {new Intl.NumberFormat("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        }).format(presupuestoItem?.total || 0)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                        {presupuestoItem?.porcentajeUsado.toFixed(2) || 0}%
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-green-600 font-bold">
                        {new Intl.NumberFormat("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        }).format(item.total)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                        {(item.porcentajeUsado || 0).toFixed(2)}%
                      </td>
                      <td
                        className={`whitespace-nowrap px-4 py-3 text-gray-700 font-bold ${
                          diferenciaItem?.diferencia < 0 ? "text-red-600" : ""
                        }`}
                      >
                        {new Intl.NumberFormat("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        }).format(diferenciaItem?.diferencia || 0)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ToastContainer />
    </section>
  );
};

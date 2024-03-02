import client from "../../../api/axios";
import { css } from "@emotion/react";
import { SyncLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { useIngresosContext } from "../../../context/IngresosProvider";
import { useState } from "react";
import { ModalEliminar } from "../../../components/ui/ModalEliminar";
import { ModalEditarIngreso } from "../../../components/generarRecibos/ModalEditarIngreso";
import { eliminarIngreso } from "../../../api/ingresos";
import { ToastContainer } from "react-toastify";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ImprimirEstadisticaPdf } from "../../../components/pdf/ImprirmirEstadisticaPdf";

export const GenerarRecibosEstadistica = () => {
  //   const { ingresos } = useIngresosContext();

  const { openModalEditarTwo } = useIngresosContext();

  const [isOpenEliminar, setIsOpenEliminar] = useState(false);

  const [obtenerId, setObtenerId] = useState("");

  const [obtenerIdTwo, setObtenerIdTwo] = useState([]);

  const openModalEliminar = () => {
    setIsOpenEliminar(true);
  };

  const closeModalEliminar = () => {
    setIsOpenEliminar(false);
  };

  const handleId = (id) => {
    setObtenerId(id);
  };

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [datos, setDatos] = useState([]);

  const [loading, setLoading] = useState(false);

  const obtenerIngresoRangoFechas = async (fechaInicio, fechaFin) => {
    try {
      // Setea el estado de loading a true para mostrar el spinner
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

  const total = datos.reduce(
    (accumulator, p) => accumulator + parseFloat(p.total),
    0
  );

  const totalFormatted = Number(total).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  // Consolidar ingresos por tipo y sumar los totales
  const ingresosConsolidados = datos.reduce((consolidado, ingreso) => {
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
  const ingresosPorTipo = datos.reduce((acumulador, ingreso) => {
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

  const presupuestoMensualTotal = presupuesto.reduce(
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
              fileName={`planilla_completa_${fechaInicio}_${fechaFin}`}
              document={
                <ImprimirEstadisticaPdf
                  presupuestoMensual={presupuesto}
                  ingresoMensual={ingresosDistribuidos}
                  diferenciaPorTipo={diferenciaPorTipo}
                />
              }
            >
              Descargar o imprimir
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
          Total del presupuesto{" "}
          <span className="text-indigo-500 text-sm font-semibold">
            {presupuesto.map((p) =>
              Number(p.total).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })
            )}
          </span>
        </div>
        -
        <div className="text-sm text-slate-700 font-normal flex gap-3 items-center">
          Total de los ingresos{" "}
          <span className="text-indigo-500 text-sm font-semibold">
            {totalFormatted}
          </span>
        </div>
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
              <thead>
                <tr className="border-b-[1px]">
                  <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                    Tipo
                  </th>
                  <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                    Total
                  </th>
                  <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                    Porcentaje usado
                  </th>
                  <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
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
        )}
      </div>

      <ModalEliminar
        datoUno={datos}
        datoDos={setDatos}
        isOpenEliminar={isOpenEliminar}
        closeModalEliminar={closeModalEliminar}
        obtenerId={obtenerId}
        eliminar={eliminarIngreso}
      />
      <ModalEditarIngreso
        setDatos={setDatos}
        datos={datos}
        obtenerId={obtenerIdTwo}
      />

      <ToastContainer />
    </section>
  );
};

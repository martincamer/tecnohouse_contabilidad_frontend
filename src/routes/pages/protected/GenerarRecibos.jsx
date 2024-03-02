import client from "../../../api/axios";
import { Link } from "react-router-dom";
import { useIngresosContext } from "../../../context/IngresosProvider";
import { useState } from "react";
import { Buscador } from "../../../components/generarRecibos/Buscador";
import { ModalEliminar } from "../../../components/ui/ModalEliminar";
import { ModalEditarIngreso } from "../../../components/generarRecibos/ModalEditarIngreso";
import { eliminarIngreso } from "../../../api/ingresos";
import { ToastContainer } from "react-toastify";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ImprimirPdf } from "../../../components/pdf/ImprirmirPdf";
import { css } from "@emotion/react";
import { SyncLoader } from "react-spinners";

export const GenerarRecibos = () => {
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
      // Independientemente de si la solicitud es exitosa o falla, establece el estado de loading a false
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  const buscarIngresosPorFecha = () => {
    obtenerIngresoRangoFechas(fechaInicio, fechaFin);
  };

  console.log(datos);

  const itemsPerPage = 10; // Cantidad de elementos por página
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResults = datos?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(datos.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const [busqueda, setBusqueda] = useState("");

  const handleBusquedaChange = (event) => {
    setBusqueda(event.target.value);
  };

  const resultadosFiltrados = currentResults.filter(
    (item) =>
      (item.detalle &&
        item.detalle.toLowerCase().includes(busqueda.toLowerCase())) ||
      (item.tipo && item.tipo.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const handleIdTwo = (id) => {
    setObtenerIdTwo(id);
  };

  //presupuesto buscador por mes.

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

  console.log(totalFormatted);

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
          Buscar ingresos de mes a mes.
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
            Buscar Ingresos
          </button>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <label className="text-sm text-indigo-500">Mes</label>
        <input
          className="text-sm bg-slate-100 py-1 px-2 rounded-lg shadow border-slate-300 border-[1px] cursor-pointer text-slate-700 outline-none w-1/5"
          type="text"
          placeholder="Escribe un numero del mes (ej. 2: febrero)"
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
        <Buscador
          busqueda={busqueda}
          handleBusquedaChange={handleBusquedaChange}
        />
        <div>
          <button
            className="bg-slate-700 text-white py-2 px-5 rounded-lg text-sm flex gap-2 items-center"
            type="button"
          >
            <PDFDownloadLink
              fileName={`planilla_completa_${fechaInicio}_${fechaFin}`}
              document={
                <ImprimirPdf
                  presupuestoMensual={presupuesto}
                  ingresoMensual={datos}
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
        <div className="overflow-x-auto rounded-lg border border-gray-200 mt-5">
          {loading ? (
            // Muestra el spinner mientras se cargan los datos
            <div className="flex justify-center items-center h-40">
              <SyncLoader color="#4A90E2" size={6} margin={6} />
              <p className="animate-blink text-slate-700 text-sm">
                Buscando los datos...
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
              <thead>
                <tr className="border-b-[1px]">
                  <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                    Numero
                  </th>
                  <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                    Tipo
                  </th>
                  <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                    Detalle
                  </th>
                  <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                    Ingreso
                  </th>
                  <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                    Total
                  </th>
                  <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                    Editar
                  </th>
                  <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                    Ver
                  </th>
                  <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                    Eliminar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-left">
                {resultadosFiltrados.map((i) => (
                  <tr
                    key={i.id}
                    className="hover:bg-slate-100 transition-all ease-in-out duration-200 cursor-pointer"
                  >
                    <td className="py-3 px-3 text-sm text-left text-slate-700">
                      {i.id}
                    </td>
                    <td className="py-3 px-3 text-sm text-left text-slate-700 capitalize">
                      {i.tipo}
                    </td>
                    <td className="py-3 px-3 text-sm text-left text-slate-700 capitalize">
                      {i.detalle}
                    </td>
                    <td className="py-3 px-3 text-sm text-left text-slate-700">
                      {Number(i?.total).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })}
                    </td>
                    <td className="py-3 px-3 text-sm text-left text-slate-700 font-bold">
                      {Number(i?.total).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })}
                    </td>
                    <td className="py-3 px-3 text-sm text-left text-slate-700">
                      <button
                        onClick={() => {
                          handleIdTwo(i?.id), openModalEditarTwo();
                        }}
                        type="button"
                        className="bg-indigo-500/10 border-[1px] border-indigo-500 py-1 px-3 text-indigo-600 rounded-lg text-left flex gap-2 items-center"
                      >
                        Editar
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </button>
                    </td>
                    <td className="py-3 px-3 text-sm text-left text-slate-700">
                      <button
                        type="button"
                        className="bg-slate-500/10 border-[1px] border-slate-500 py-1 px-3 rounded-lg text-left text-slate-700 flex gap-2 items-center"
                      >
                        Ver ingreso
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                          />
                        </svg>
                      </button>
                    </td>

                    <td className="py-3 px-3 text-sm text-left text-slate-700">
                      <button
                        onClick={() => {
                          handleId(i?.id), openModalEliminar();
                        }}
                        type="button"
                        className="bg-red-500/10 border-[1px] border-red-500 py-1 px-3 rounded-lg text-left text-red-700 flex gap-2 items-center"
                      >
                        Eliminar
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
                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center mt-4 mb-4 gap-3">
              <button
                className="mx-1 px-3 py-1 rounded bg-gray-100 shadow shadow-black/20 text-sm flex gap-1 items-center hover:bg-indigo-500 transiton-all ease-in duration-100 hover:text-white"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
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
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
                Anterior
              </button>
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-indigo-500 hover:bg-primary transition-all ease-in-out text-white shadow shadow-black/20 text-sm"
                      : "bg-gray-100 shadow shadow-black/20 text-sm"
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="mx-1 px-3 py-1 rounded bg-gray-100 shadow shadow-black/20 text-sm flex gap-1 items-center hover:bg-indigo-500 transiton-all ease-in duration-100 hover:text-white"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente{" "}
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
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
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

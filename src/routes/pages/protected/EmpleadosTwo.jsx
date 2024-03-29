import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useEmpleadosContext } from "../../../context/EmpleadosProvider";
import { ModalCrearFabrica } from "../../../components/empleados/ModalCrearFabrica";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ImprimirPdfEmpleados } from "../../../components/empleados/ImprimirPdfEmpleados";
import { ImprimirComprobantesCincoTodo } from "../../../components/pdf/ImprimirComprobantesCincoTodo";
import { ImprimirComprobantesVeinteTodo } from "../../../components/pdf/ImprimirComprobantesVeinteTodo";
import { ImprimirComprobanteMensualTodo } from "../../../components/pdf/ImprimirComprobantesMensualTodo";

export const EmpleadosTwo = () => {
  const { empleados, fabricas } = useEmpleadosContext();

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  //buscador y filtrador
  const [busqueda, setBusqueda] = useState("");
  const [filtroFabrica, setFiltroFabrica] = useState("");
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    // Filtrar empleados por búsqueda y tipo de fábrica
    const empleadosFiltrados = empleados.filter((empleado) => {
      const cumpleBusqueda = empleado.empleado
        .toLowerCase()
        .includes(busqueda.toLowerCase());
      const cumpleFiltro =
        !filtroFabrica || empleado.tipo_fabrica === filtroFabrica;
      return cumpleBusqueda && cumpleFiltro && [];
    });

    setResultados(empleadosFiltrados);
  }, [empleados, busqueda, filtroFabrica]);

  const totalFinalSum = resultados?.reduce((acumulador, empleado) => {
    // Convertir el valor de total_final a número y sumarlo al acumulador
    return acumulador + parseFloat(empleado?.total_final);
  }, 0);

  const totalFinalQuincenaCinco = resultados?.reduce((acumulador, empleado) => {
    // Convertir el valor de total_final a número y sumarlo al acumulador
    return acumulador + parseFloat(empleado?.total_quincena);
  }, 0);

  const totalFinalQuincenaVeinte = resultados?.reduce(
    (acumulador, empleado) => {
      // Convertir el valor de total_final a número y sumarlo al acumulador
      return acumulador + parseFloat(empleado?.total_quincena_veinte);
    },
    0
  );

  // Crear un conjunto para almacenar tipos de fábrica únicos
  const tiposFabricaUnicos = new Set(
    empleados.map((empleado) => empleado.tipo_fabrica)
  );

  // Convertir el conjunto a un array
  const tiposFabricaUnicosArray = Array.from(tiposFabricaUnicos);

  // Obtener la fecha actual
  const fechaActual = new Date();

  // Obtener el día de la semana (0 para domingo, 1 para lunes, ..., 6 para sábado)
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
  const fechaFormateada = `${diasSemana[diaDeLaSemana]} ${meses[mes]} / ${diaDelMes} / ${ano}`;

  const itemsPerPage = 10; // Cantidad de elementos por página
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResults = resultados?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(resultados.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataLoadedTwo, setDataLoadedTwo] = useState(false);
  const [dataLoadedTree, setDataLoadedTree] = useState(false);
  const [dataLoadedFourty, setDataLoadedFourty] = useState(false);

  const downloadRef = useRef(false);

  const handleLoadData = () => {
    // Simulate data loading (replace with your actual logic)
    setTimeout(() => {
      setDataLoaded(true);
      downloadRef.current = true;
    }, 1000);
  };

  useEffect(() => {
    if (downloadRef.current) {
      setDataLoaded(false);
      downloadRef.current = false;
    }
  }, [resultados]);

  const handleLoadDataTwo = () => {
    // Simulate data loading (replace with your actual logic)
    setTimeout(() => setDataLoadedTwo(true), 500);
  };

  const handleLoadDataTree = () => {
    // Simulate data loading (replace with your actual logic)
    setTimeout(() => setDataLoadedTree(true), 500);
  };

  const handleLoadDataFourty = () => {
    // Simulate data loading (replace with your actual logic)
    setTimeout(() => setDataLoadedFourty(true), 500);
  };

  return (
    <section className=" py-16 w-full h-full flex flex-col gap-5">
      <Link
        to={"/empleados"}
        className="px-10 absolute flex top-4 text-sm font-bold text-indigo-500 gap-2 items-center"
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
        VOLVER A EMPLEADOS
      </Link>

      <div className="px-10">
        <div className="bg-white w-full py-4 px-6 border-[1px] border-slate-300 shadow-md rounded-lg flex gap-4">
          <div>
            <button
              className="bg-slate-700 text-white py-2 px-5 rounded-lg text-sm flex gap-2 items-center cursor-pointer"
              type="button"
            >
              <div>
                {!dataLoaded && (
                  <button onClick={handleLoadData}>
                    Descargar todo el resumen
                  </button>
                )}
                {dataLoaded && (
                  <PDFDownloadLink
                    fileName={`Resumen empleados ${tiposFabricaUnicosArray.map(
                      (tipo) => tipo
                    )} - fecha_${fechaFormateada}`}
                    document={<ImprimirPdfEmpleados empleados={resultados} />}
                    download={() => setDataLoaded(false)}
                  >
                    Hacer click para descargar..
                  </PDFDownloadLink>
                )}
              </div>
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
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </button>
          </div>

          <div>
            <button
              className="bg-slate-700 text-white py-2 px-5 rounded-lg text-sm flex gap-2 items-center cursor-pointer"
              type="button"
            >
              <div>
                {!dataLoadedTwo && (
                  <button onClick={handleLoadDataTwo}>
                    Descargar comprobantes de la quincena del 5
                  </button>
                )}
                {dataLoadedTwo && (
                  <PDFDownloadLink
                    document={
                      <ImprimirComprobantesCincoTodo datos={resultados} />
                    }
                    download={() => setDataLoadedTwo(false)}
                    target="_blank"
                  >
                    Hacer click para descargar..
                  </PDFDownloadLink>
                )}
              </div>
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
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </button>
          </div>

          <div>
            <button
              className="bg-slate-700 text-white py-2 px-5 rounded-lg text-sm flex gap-2 items-center cursor-pointer"
              type="button"
            >
              <div>
                {!dataLoadedTree && (
                  <button onClick={handleLoadDataTree}>
                    Descargar comprobantes de la quincena del 20
                  </button>
                )}
                {dataLoadedTree && (
                  <PDFDownloadLink
                    document={
                      <ImprimirComprobantesVeinteTodo datos={resultados} />
                    }
                    download={() => setDataLoadedTree(false)}
                    target="_blank"
                  >
                    Hacer click para descargar..
                  </PDFDownloadLink>
                )}
              </div>
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
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </button>
          </div>

          <div>
            <button
              className="bg-slate-700 text-white py-2 px-5 rounded-lg text-sm flex gap-2 items-center cursor-pointer"
              type="button"
            >
              <div>
                {!dataLoadedFourty && (
                  <button onClick={handleLoadDataFourty}>
                    Descargar comprobantes mensuales
                  </button>
                )}
                {dataLoadedFourty && (
                  <PDFDownloadLink
                    document={
                      <ImprimirComprobanteMensualTodo datos={resultados} />
                    }
                    download={() => setDataLoadedFourty(false)}
                    target="_blank"
                  >
                    Hacer click para descargar..
                  </PDFDownloadLink>
                )}
              </div>
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
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-16 items-center px-10">
        <div className="relative w-1/5 rounded-xl border-slate-300 border-[1px] py-2.5 pr-10 shadow-sm sm:text-sm cursor-pointer">
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar el empleado..."
            type="text"
            id="Search"
            className="outline-none px-2 w-full"
          />
          <span className="absolute inset-y-0 right-0 grid w-10 place-content-center">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-700"
              // onClick={handleSearch}
            >
              <span className="sr-only">Search</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </span>
        </div>
        <div className="flex gap-2 items-center cursor-pointer">
          <label className="text-sm text-slate-600">Buscar por fabrica</label>
          <select
            value={filtroFabrica}
            onChange={(e) => setFiltroFabrica(e.target.value)}
            className="cursor-pointer rounded-xl bg-white px-4 border-slate-300 border-[1px] py-2.5 shadow uppercase text-slate-600 text-sm"
            name=""
            id=""
          >
            <option value="">Todos</option>
            {fabricas.map((f) => (
              <option value={f.tipo} key={f.id}>
                {f.tipo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-screen px-4">
        <div className="overflow-x-auto rounded-lg border border-gray-200 mt-5">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead>
              <tr className="border-b-[1px]">
                <th className="py-4 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  Empleado
                </th>
                <th className="py-4 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  Fecha
                </th>
                <th className="py-4 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  Antg.
                </th>
                <th className="py-4 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  Tipo
                </th>
                <th className="py-4 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  Sucrsal o Fabr.
                </th>
                <th className="py-4 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  mes 5
                </th>
                <th className="py-4 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  mes 20
                </th>
                <th className="py-4 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  Antiguedad
                </th>
                <th className="py-4 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  Desc.
                </th>
                <th className="py-4 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  Banco
                </th>
                <th className="py-4 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  Total Final
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-left">
              {currentResults.map((e) => (
                <tr
                  key={e.id}
                  className=" hover:bg-slate-100 transition-all ease-in-out duration-200 cursor-pointer"
                >
                  <td className="py-3 px-3 text-xs font-semibold text-left text-slate-600 capitalize">
                    {e.empleado}
                  </td>
                  <td className="py-3 px-3 text-xs font-semibold text-left text-slate-600">
                    {new Date(e.fecha).getFullYear()}
                  </td>
                  <td className="py-3 px-3 text-xs font-semibold text-left text-slate-600">
                    {e.antiguedad}
                  </td>
                  <td className="py-3 px-3 text-xs font-semibold text-left text-slate-600 capitalize">
                    {e.tipo}
                  </td>
                  <td className="py-3 px-3 text-xs font-semibold text-left text-slate-600 capitalize">
                    {e.tipo_fabrica}
                  </td>
                  <td className="py-3 px-3 text-xs font-semibold text-left text-slate-600">
                    {Number(e.total_quincena).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </td>
                  <td className="py-3 px-3 text-xs font-semibold text-left text-slate-600">
                    {e.tipo !== "mensual" &&
                      Number(e.total_quincena_veinte).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })}
                  </td>
                  <td className="py-3 px-3 text-xs font-semibold text-left text-slate-600">
                    {" "}
                    {Number(e.descuento).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </td>
                  <td className="py-3 px-3 text-xs font-semibold text-left text-slate-600">
                    {" "}
                    {Number(e.banco).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </td>
                  <td className="py-3 px-3 text-xs font-semibold text-left text-slate-600">
                    {" "}
                    {Number(e.otros).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </td>
                  <td className="py-3 px-3 text-sm font-bold text-left text-green-600">
                    {Number(e.total_final).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      <ModalCrearFabrica isOpen={isOpen} closeModal={closeModal} />
    </section>
  );
};

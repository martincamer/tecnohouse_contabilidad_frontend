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
    <section className="px-5 py-16 w-full h-full flex flex-col gap-5">
      <div className="font-semibold text-xl">
        Bienvenido al sector comprobantes, descarga todos los comprobantes
        mensuales,quincenales,etc 🖐️
      </div>
      <div className="px-0">
        <div className="bg-white w-full py-6 px-6 shadow-xl rounded-2xl flex gap-4">
          <div>
            <button
              className="bg-green-100 text-green-600 font-bold uppercase py-2 px-5 rounded-lg text-sm flex gap-2 items-center cursor-pointer"
              type="button"
            >
              <div>
                {!dataLoaded && (
                  <button className="uppercase" onClick={handleLoadData}>
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
              className="bg-slate-200 text-slate-800 uppercase font-bold py-2 px-5 rounded-lg text-sm flex gap-2 items-center cursor-pointer"
              type="button"
            >
              <div>
                {!dataLoadedTwo && (
                  <button className="uppercase" onClick={handleLoadDataTwo}>
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
                className="w-5 h-5"
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
              className="bg-slate-200 text-slate-800 uppercase font-bold py-2 px-5 rounded-lg text-sm flex gap-2 items-center cursor-pointer"
              type="button"
            >
              <div>
                {!dataLoadedTree && (
                  <button className="uppercase" onClick={handleLoadDataTree}>
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
                className="w-5 h-5"
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
              className="bg-orange-100 text-orange-600 uppercase font-bold py-2 px-5 rounded-lg text-sm flex gap-2 items-center cursor-pointer"
              type="button"
            >
              <div>
                {!dataLoadedFourty && (
                  <button className="uppercase" onClick={handleLoadDataFourty}>
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
      <div className="flex gap-16 items-center px-0 mt-4">
        <div className="relative w-1/5 rounded-2xl bg-white py-3 shadow-xl pr-10 sm:text-sm cursor-pointer">
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar el empleado..."
            type="text"
            id="Search"
            className="outline-none px-2 w-full uppercase bg-white font-semibold"
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
          <label className="text-sm text-slate-600 uppercase font-bold">
            Buscar por fabrica
          </label>
          <select
            value={filtroFabrica}
            onChange={(e) => setFiltroFabrica(e.target.value)}
            className="cursor-pointer rounded-2xl bg-white px-4 border-slate-300 border-[1px] py-3 shadow-xl font-semibold uppercase text-slate-600 text-sm border-none"
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
      <div className="rounded-2xl hover:shadow-md cursor-pointer transition-all ease-linear shadow-xl mt-5 bg-white py-2">
        <table className="min-w-full divide-y-2 divide-gray-200 text-sm table">
          <thead>
            <tr className="border-b-[1px]">
              <th className="py-6 px-3 uppercase text-sm font-bold text-indigo-600 text-left">
                Empleado
              </th>
              <th className="py-6 px-3 uppercase text-sm font-bold text-indigo-600 text-left">
                Fecha
              </th>
              <th className="py-6 px-3 uppercase text-sm font-bold text-indigo-600 text-left">
                Antg.
              </th>
              <th className="py-6 px-3 uppercase text-sm font-bold text-indigo-600 text-left">
                Tipo
              </th>
              <th className="py-6 px-3 uppercase text-sm font-bold text-indigo-600 text-left">
                Sucrsal o Fabr.
              </th>
              <th className="py-6 px-3 uppercase text-sm font-bold text-indigo-600 text-left">
                mes 5
              </th>
              <th className="py-6 px-3 uppercase text-sm font-bold text-indigo-600 text-left">
                mes 20
              </th>
              <th className="py-6 px-3 uppercase text-sm font-bold text-indigo-600 text-left">
                Desc mes 5.
              </th>
              <th className="py-6 px-3 uppercase text-sm font-bold text-indigo-600 text-left">
                Desc mes 20.
              </th>
              <th className="py-6 px-3 uppercase text-sm font-bold text-indigo-600 text-left">
                Banco
              </th>
              <th className="py-6 px-3 uppercase text-sm font-bold text-indigo-600 text-left">
                Otros
              </th>
              <th className="py-6 px-3 uppercase text-sm font-bold text-indigo-600 text-left">
                Sueldo final
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-left">
            {currentResults.map((e) => (
              <tr key={e.id} className="cursor-pointer">
                <td className="py-3 px-3 text-sm font-normal text-left text-slate-600 uppercase">
                  {e.empleado}
                </td>
                <td className="py-3 px-3 text-sm font-normal text-left text-slate-600">
                  {new Date(e.fecha).getFullYear()}
                </td>
                <td className="py-3 px-3 text-sm font-bold text-left text-slate-600">
                  {e.antiguedad}
                </td>
                <td className="py-3 px-3 text-sm font-normal text-left text-slate-600 uppercase">
                  {e.tipo}
                </td>
                <td className="py-3 px-3 text-sm font-normal text-left text-slate-600 uppercase">
                  {e.tipo_fabrica}
                </td>
                <td className="py-3 px-3 text-sm text-left text-slate-600 font-bold">
                  {Number(e.total_quincena).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </td>
                <td className="py-3 px-3 text-sm text-left text-slate-600 font-bold">
                  {(e.tipo !== "mensual" &&
                    Number(e.total_quincena_veinte).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })) ||
                    0}
                </td>

                <td className="py-3 px-3 text-sm text-left text-slate-600 font-bold">
                  {" "}
                  {Number(e.descuento).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  }) || 0}
                </td>

                <td className="py-3 px-3 text-sm text-left text-slate-600 font-bold">
                  {" "}
                  {Number(e.descuento_20).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  }) || 0}
                </td>
                <td className="py-3 px-3 text-sm text-left text-slate-600 font-bold">
                  {" "}
                  {Number(e.otros).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  }) || 0}
                </td>
                <td className="py-3 px-3 text-sm text-left text-slate-600 font-bold">
                  {" "}
                  {Number(e.banco).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  }) || 0}
                </td>
                <td className="py-3 px-3 text-sm font-bold text-left text-green-600">
                  {Number(e.total_final).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  }) || 0}
                </td>
                <td className="py-3 px-3 text-sm text-left text-slate-700 flex items-start">
                  <div className="dropdown dropdown-left dropdown-bottom z-10">
                    <div
                      tabIndex={0}
                      role="button"
                      className="m-1 hover:bg-slate-200 py-2 px-2 rounded-full transition-all ease-linear"
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
                          d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                        />
                      </svg>
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow bg-base-100 rounded-2xl border w-52 z-[100] gap-2"
                    >
                      {/* <li>
                        <Link
                          target="_blank" // Esto abre el enlace en una nueva pestaña
                          rel="noopener noreferrer" // Se recomienda para seguridad y prevención de ataques
                          to={`/empleados/${e.id}`}
                          className=" bg-slate-200 py-2 px-3 rounded-xl text-left text-slate-700 flex gap-2 items-center text-xs font-semibold uppercase justify-between"
                        >
                          Ver
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
                              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                            />
                          </svg>
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={() => {
                            handleId(e.id), openModalEdit();
                          }}
                          type="button"
                          className=" bg-indigo-100 text-center py-2 px-3 rounded-xl text-indigo-500 flex gap-2 items-center text-xs font-semibold uppercase justify-between"
                        >
                          Editar
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
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </Link>
                      </li> */}
                      <li>
                        {e.tipo === "quincenal" ? (
                          <>
                            <Link
                              to={`/view-pdf-5/${e.id}`}
                              target="_blank" // Esto abre el enlace en una nueva pestaña
                              rel="noopener noreferrer" // Se recomienda para seguridad y prevención de ataques
                              className=" bg-green-100 text-center py-2 px-3 rounded-xl text-green-500 flex gap-2 items-center text-xs font-semibold uppercase w-full mb-2"
                            >
                              Imprimir 5
                            </Link>
                            <Link
                              to={`/view-pdf-20/${e.id}`}
                              target="_blank" // Esto abre el enlace en una nueva pestaña
                              rel="noopener noreferrer" // Se recomienda para seguridad y prevención de ataques
                              className=" bg-orange-100 text-center py-2 px-3 rounded-xl text-orange-600 flex gap-2 items-center text-xs font-semibold uppercase w-full"
                            >
                              Imprimir 20
                            </Link>
                          </>
                        ) : (
                          <Link
                            to={`/view-pdf-mensual/${e.id}`}
                            target="_blank" // Esto abre el enlace en una nueva pestaña
                            rel="noopener noreferrer" // Se recomienda para seguridad y prevención de ataques
                            className=" bg-green-100 text-center py-2 px-3 rounded-xl text-green-500 flex gap-2 items-center text-xs font-semibold uppercase"
                          >
                            Imprimir Mensual
                          </Link>
                        )}
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center mt-4 mb-4 gap-1">
            <button
              className="mx-1 px-2 py-1 bg-white border-slate-300 border-[1px] shadow shadow-black/20 text-sm flex gap-1 items-center transiton-all ease-in duration-100 text-slate-700 rounded-xl"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
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
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`mx-1 px-3 py-1.5 rounded-xl ${
                  currentPage === index + 1
                    ? "bg-indigo-500 border border-indigo-500 hover:bg-indigo/600 transition-all ease-in-out text-white shadow shadow-black/20 text-sm"
                    : "bg-white border-slate-300 border-[1px] shadow shadow-black/20 text-sm"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="mx-1 px-2 py-1 bg-white border-slate-300 border-[1px] shadow shadow-black/20 text-sm flex gap-1 items-center transiton-all ease-in duration-100 text-slate-700 rounded-xl"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
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
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      <ModalCrearFabrica isOpen={isOpen} closeModal={closeModal} />
    </section>
  );
};

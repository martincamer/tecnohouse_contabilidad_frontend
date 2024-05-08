import { Link } from "react-router-dom";
import { useEmpleadosContext } from "../../../context/EmpleadosProvider";
import { useEffect, useState } from "react";
import { ModalCrearFabrica } from "../../../components/empleados/ModalCrearFabrica";
import { ModalEditarEmpleado } from "../../../components/empleados/ModalEditarEmpleado";
import { ModalGuardarDatosFinal } from "../../../components/empleados/ModalGuardarDatosFinal";
import client from "../../../api/axios";
import { ModalCrearEmpleado } from "../../../components/empleados/ModalCrearEmpleado";
import { ModalEmpleado } from "../../../components/empleados/ModalEmpleado";

export const Empleados = () => {
  const { empleados, fabricas } = useEmpleadosContext();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCrear, setIsOpenCrear] = useState(false);
  const [isEmpleado, setIsEmpleado] = useState(false);

  const openModalCrear = () => {
    setIsOpenCrear(true);
  };

  const closeModalCrear = () => {
    setIsOpenCrear(false);
  };

  const openModalEmpleado = () => {
    setIsEmpleado(true);
  };

  const closeModalEmpleado = () => {
    setIsEmpleado(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const [isEdit, setIsEdit] = useState(false);
  const openModalEdit = () => {
    setIsEdit(true);
  };

  const closeModalEdit = () => {
    setIsEdit(false);
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
      return cumpleBusqueda && cumpleFiltro;
    });

    setResultados(empleadosFiltrados);
  }, [empleados, busqueda, filtroFabrica]);

  const totalFinalQuincenaCinco = resultados
    // Filtrar solo los empleados que tienen tipo === "quincena"
    .filter((empleado) => empleado.tipo === "quincenal")
    // Reducir la lista filtrada sumando el valor de total_quincena convertido a número
    .reduce((acumulador, empleado) => {
      // Convertir el valor de total_final a número y sumarlo al acumulador
      return acumulador + parseFloat(empleado?.total_quincena);
    }, 0);

  const totalFinalQuincenaCincoBanco = resultados.reduce(
    (acumulador, empleado) => {
      // Convertir el valor de total_final a número y sumarlo al acumulador
      return acumulador + parseFloat(empleado?.otros);
    },
    0
  );

  const totalFinalMensualDinero = resultados
    // Filtrar solo los empleados que tienen tipo === "quincena"
    .filter((empleado) => empleado.tipo === "mensual")
    // Reducir la lista filtrada sumando el valor de total_quincena convertido a número
    .reduce((acumulador, empleado) => {
      // Convertir el valor de total_final a número y sumarlo al acumulador
      return acumulador + parseFloat(empleado?.total_final - empleado?.otros);
    }, 0);

  const totalFinalQuincenaVeinte = resultados
    // Filtrar solo los empleados que tienen tipo === "quincena_veinte"
    .filter((empleado) => empleado.tipo === "quincenal")
    // Reducir la lista filtrada sumando el valor de total_quincena_veinte convertido a número
    .reduce((acumulador, empleado) => {
      // Convertir el valor de total_final a número y sumarlo al acumulador
      return acumulador + parseFloat(empleado?.total_quincena_veinte);
    }, 0);

  const totalFinalMensual = resultados
    // Filtrar solo los empleados que tienen tipo === "quincena_veinte"
    .filter((empleado) => empleado.tipo === "mensual")
    // Reducir la lista filtrada sumando el valor de total_quincena_veinte convertido a número
    .reduce((acumulador, empleado) => {
      // Convertir el valor de total_final a número y sumarlo al acumulador
      return (
        acumulador +
        parseFloat(empleado?.total_quincena) +
        parseFloat(empleado?.otros) +
        parseFloat(empleado?.comida_produccion) +
        parseFloat(empleado?.premio_produccion)
      );
    }, 0);

  const itemsPerPage = 15; // Cantidad de elementos por página
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResults = resultados?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(resultados.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  function generarID() {
    const caracteres =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const longitud = 10;
    let id = "";
    for (let i = 0; i < longitud; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      id += caracteres.charAt(indice);
    }
    return id;
  }

  const handleSubmit = async () => {
    // Generar un nuevo ID para cada empleado antes de enviar los datos al backend
    const empleadosConIDs = empleados.map((empleado) => ({
      ...empleado,
      id: generarID(), // Generar un nuevo ID aleatorio para cada empleado
    }));

    try {
      const response = await client.post("/empleados-datos", {
        datos: empleadosConIDs, // Usar empleadosConIDs que contiene los nuevos IDs generados
      });

      console.log(response);
    } catch (error) {
      console.log(error.response);
    }
  };

  const [obtenerId, setObtenerId] = useState(null);

  const handleId = (id) => setObtenerId(id);

  const [guardarDatosFinal, setGuardarDatosFinal] = useState(false);

  const openGuardarDatosFinal = () => {
    setGuardarDatosFinal(true);
  };

  const closeGuardarDatosFinal = () => {
    setGuardarDatosFinal(false);
  };

  return (
    <section className="px-5 py-16 w-full h-full flex flex-col gap-5">
      <div className="font-semibold text-xl">
        Bienvenido al sector empleados, crea nuevos empleados,edita,etc 🖐️
      </div>
      <div>
        <div className="w-full grid grid-cols-4 gap-3">
          <article className="cursor-pointer flex justify-between items-start rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-xl shadow-lg border-none transition-all ease-in-out">
            <div className="flex gap-4 items-center">
              <span className="rounded-full bg-indigo-100 p-4 text-indigo-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-9 h-9"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </span>

              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {" "}
                  {Number(resultados.length)}
                </p>

                <p className="text-sm text-gray-600 underline">
                  TOTAL EMPLEADOS CARGADOS
                </p>
              </div>
            </div>
          </article>

          <article className="cursor-pointer flex justify-between items-start rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-xl shadow-lg border-none transition-all ease-in-out">
            <div className="flex gap-4 items-center">
              <span className="rounded-full bg-green-100 p-4 text-green-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-9 h-9"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </span>

              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Number(
                    Number(totalFinalQuincenaCinco) + Number(totalFinalMensual)
                  ).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>

                <p className="text-sm text-gray-600 underline">
                  TOTAL QUINCENA A PAGAR DEL 5
                </p>
              </div>
            </div>
          </article>

          <article className="cursor-pointer flex justify-between items-start rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-xl shadow-lg border-none transition-all ease-in-out">
            <div className="flex gap-4 items-center">
              <span className="rounded-full bg-green-100 p-4 text-green-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-9 h-9"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </span>

              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {" "}
                  {Number(totalFinalQuincenaVeinte).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>

                <p className="text-sm text-gray-600 underline">
                  TOTAL QUINCENA A PAGAR DEL 20
                </p>
              </div>
            </div>
          </article>

          <article className="cursor-pointer flex justify-between items-start rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-xl shadow-lg border-none transition-all ease-in-out">
            <div className="flex gap-4 items-center">
              <span className="rounded-full bg-green-100 p-4 text-green-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-9 h-9"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </span>

              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {" "}
                  {Number(totalFinalQuincenaCincoBanco).toLocaleString(
                    "es-AR",
                    {
                      style: "currency",
                      currency: "ARS",
                    }
                  )}
                </p>

                <p className="text-sm text-gray-600 underline">
                  TOTAL QUINCENA DEL BANCO A PAGAR EL 5
                </p>
              </div>
            </div>
          </article>

          <article className="cursor-pointer flex justify-between items-start rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-xl shadow-lg border-none transition-all ease-in-out">
            <div className="flex gap-4 items-center">
              <span className="rounded-full bg-green-100 p-4 text-green-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-9 h-9"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </span>

              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {" "}
                  {Number(totalFinalMensualDinero).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>

                <p className="text-sm text-gray-600 underline">
                  TOTAL MENSUALES A PAGAR EL 5
                </p>
              </div>
            </div>
          </article>

          <article className="cursor-pointer flex justify-between items-start rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-xl shadow-lg border-none transition-all ease-in-out">
            <div className="flex gap-4 items-center">
              <span className="rounded-full bg-indigo-100 p-4 text-indigo-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-9 h-9"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"
                  />
                </svg>
              </span>

              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {" "}
                  {Number(fabricas.length)}
                </p>

                <p className="text-sm text-gray-600 underline">
                  FABRICAS CARGADAS
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
      <div>
        <div className="flex gap-2 my-5">
          <div>
            <button
              className="bg-indigo-500 text-white font-semibold uppercase py-3 px-5 rounded-full text-sm flex gap-2 items-center hover:translate-x-1 transiton-all ease-in-out duration-100"
              type="button"
            >
              <Link onClick={() => openModalCrear()}>
                Cargar nuevo empleado
              </Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-[20px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
            </button>
          </div>

          <div>
            <button
              onClick={() => openModal()}
              className="bg-indigo-500 text-white font-semibold uppercase py-3 px-5 rounded-full text-sm flex gap-2 items-center hover:translate-x-1 transiton-all ease-in-out duration-100"
              type="button"
            >
              Cargar nueva fabrica o editar fabrica
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-[20px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
            </button>
          </div>

          <div>
            <Link
              className="bg-slate-700 text-white font-semibold uppercase py-3 px-5 rounded-full text-sm flex gap-2 items-center hover:translate-x-1 transiton-all ease-in-out duration-100"
              to={"/empleados-comprobantes"}
            >
              Ir a pagina comprobantes imprimir todos/etc.
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
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex gap-16 items-center">
        <div className="relative w-1/5 rounded-2xl shadow-lg py-3 px-2 sm:text-sm cursor-pointer bg-white">
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar el empleado..."
            type="text"
            id="Search"
            className="outline-none px-2 w-full uppercase bg-white font-semibold text-slate-600"
          />
          <span className="absolute inset-y-0 right-0 grid w-10 place-content-center">
            <button type="button" className="text-gray-600 hover:text-gray-700">
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
          <label className="text-sm text-slate-500 uppercase font-bold">
            Buscar por fabrica
          </label>
          <select
            value={filtroFabrica}
            onChange={(e) => setFiltroFabrica(e.target.value)}
            className="cursor-pointer rounded-2xl bg-white px-3 shadow-xl py-3 text-slate-600 font-semibold text-sm uppercase outline-none"
          >
            <option value="">Todas las fabricas</option>
            {fabricas.map((f) => (
              <option value={f.tipo} key={f.id}>
                {f.tipo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
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
                        <li>
                          <Link
                            rel="noopener noreferrer" // Se recomienda para seguridad y prevención de ataques
                            // to={`/empleados/${e.id}`}
                            onClick={() => {
                              {
                                handleId(e.id), openModalEmpleado();
                              }
                            }}
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
                        </li>
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
      </div>

      <ModalCrearFabrica isOpen={isOpen} closeModal={closeModal} />
      <ModalEditarEmpleado
        obtenerId={obtenerId}
        isOpenEdit={isEdit}
        closeModalEdit={closeModalEdit}
      />
      <ModalGuardarDatosFinal
        closeModal={closeGuardarDatosFinal}
        isOpen={guardarDatosFinal}
        handleSubmit={handleSubmit}
      />
      <ModalCrearEmpleado
        isOpenEdit={isOpenCrear}
        closeModalEdit={closeModalCrear}
      />
      <ModalEmpleado
        obtenerId={obtenerId}
        isOpenEdit={isEmpleado}
        closeModalEdit={closeModalEmpleado}
      />
    </section>
  );
};

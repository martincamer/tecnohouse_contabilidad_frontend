import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  eliminarEmpleado,
  obtenerUnicoEmpleado,
} from "../../../api/empleados.api";
import { ToastContainer, toast } from "react-toastify";
import { useEmpleadosContext } from "../../../context/EmpleadosProvider";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ImprimirComprobante } from "../../../components/empleados/ImprimirComprobante";

export const ViewEmpleado = () => {
  const [datos, setDatos] = useState([]);

  const { empleados, setEmpleados } = useEmpleadosContext();

  const params = useParams();

  useEffect(() => {
    async function loadData() {
      const res = await obtenerUnicoEmpleado(params.id);

      setDatos(res.data);
    }

    loadData();
  }, []);

  const camposASumar = [
    "total_antiguedad",
    "premio_asistencia",
    "premio_produccion",
    "banco",
  ];

  const camposASumarTwo = ["comida_produccion"];

  const totalSumado = camposASumar.reduce(
    (total, campo) => total + Number(datos[campo]),
    0
  );

  const totalSumadoTwo = camposASumarTwo.reduce(
    (total, campo) => total + Number(datos[campo]),
    0
  );

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

  // Formatear la fecha
  const fechaFormateadaTwo = new Date(datos.fecha).toLocaleDateString("es-AR");

  const navigate = useNavigate();

  const handleEliminar = () => {
    const res = eliminarEmpleado(datos.id);

    const updatedTipos = empleados.filter((tipo) => tipo.id !== datos.id);
    setEmpleados(updatedTipos);

    toast.error("Eliminado correctamente!", {
      position: "top-right",
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    setTimeout(() => {
      navigate("/empleados");
    }, 500);
  };
  return (
    <section className=" py-16 px-10 w-full h-full flex flex-col gap-5">
      <ToastContainer />
      <Link
        to={"/"}
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
        VOLVER
      </Link>
      <div className="h-full">
        <div className="border-[1px] py-10 px-10 border-slate-300 shadow rounded-xl grid grid-cols-4 gap-3">
          <article className="flex flex-col gap-4 rounded-lg border border-slate-300 bg-white p-6">
            <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>

              <span className="text-xs font-medium">
                {" "}
                {datos.total_quincena}%{" "}
              </span>
            </div>

            <div>
              <strong className="block text-sm font-medium text-gray-500">
                {" "}
                Neto a a cobrar el 5{" "}
              </strong>

              <p>
                <span className="text-2xl font-medium text-gray-900">
                  {" "}
                  {Number(datos.total_quincena).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </span>

                <span className="text-xs text-gray-500">
                  {" "}
                  +
                  {Number(totalSumado).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}{" "}
                </span>
              </p>
            </div>
          </article>

          {datos.tipo !== "mensual" && (
            <article className="flex flex-col gap-4 rounded-lg border border-slate-300 bg-white p-6">
              <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>

                <span className="text-xs font-medium">
                  {" "}
                  {datos.total_quincena_veinte}%{" "}
                </span>
              </div>

              <div>
                <strong className="block text-sm font-medium text-gray-500">
                  {" "}
                  Neto a cobrar el 20{" "}
                </strong>

                <p>
                  <span className="text-2xl font-medium text-gray-900">
                    {" "}
                    {Number(datos.total_quincena_veinte).toLocaleString(
                      "es-AR",
                      {
                        style: "currency",
                        currency: "ARS",
                      }
                    )}
                  </span>

                  <span className="text-xs text-gray-500">
                    {" "}
                    +
                    {Number(totalSumadoTwo).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}{" "}
                  </span>
                </p>
              </div>
            </article>
          )}

          <article className="flex flex-col gap-4 rounded-lg border border-slate-300 bg-white p-6">
            <div className="inline-flex gap-2 self-end rounded bg-indigo-100 p-1 text-indigo-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>

              <span className="text-xs font-medium">
                {" "}
                {datos.total_final}%{" "}
              </span>
            </div>

            <div>
              <strong className="block text-sm font-medium text-gray-500">
                {" "}
                Neto a cobrar mensual{" "}
              </strong>

              <p>
                <span className="text-2xl font-medium text-gray-900">
                  {" "}
                  {Number(datos.total_final).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </span>

                <span className="text-xs text-gray-500">
                  {" "}
                  +
                  {Number(totalSumadoTwo).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}{" "}
                </span>
              </p>
            </div>
          </article>
          <article className="flex flex-col gap-4 rounded-lg border border-slate-300 bg-white p-6">
            <div className="inline-flex gap-2 self-end rounded bg-indigo-100 p-1 text-indigo-600">
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
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>

              <span className="text-xs font-medium"> {meses[mes]} </span>
            </div>

            <div>
              <strong className="block text-sm font-medium text-gray-500">
                {" "}
                Fecha del mes{" "}
              </strong>

              <p>
                <span className="text-xl font-medium text-gray-900 capitalize">
                  {fechaFormateada}
                </span>
              </p>
            </div>
          </article>
        </div>

        <div className="mt-10 border-slate-300 border-[1px] rounded-xl shadow px-10 py-10">
          <div className="flex">
            <p className="text-slate-700 font-semibold bg-slate-200 py-1 px-4 rounded-xl ">
              EMPLEADO RESUMEN
            </p>
          </div>

          <div className="border-slate-300 border-[1px] rounded-xl px-5 py-10 shadow w-1/2 mt-5 space-y-3">
            <div className="flex gap-2">
              <p className="uppercase text-slate-700 font-bold">
                Nombre y Apellido
              </p>
              <p className="uppercase text-slate-700">{datos.empleado}</p>
            </div>

            <div className="flex gap-2">
              <p className="uppercase text-slate-700 font-bold">
                Tipo de sueldo
              </p>
              <p className="uppercase text-slate-700">{datos.tipo}</p>
            </div>

            <div className="flex gap-2">
              <p className="uppercase text-slate-700 font-bold">
                Fabrica o Suc.
              </p>
              <p className="uppercase text-slate-700">{datos.tipo_fabrica}</p>
            </div>

            <div className="flex gap-2">
              <p className="uppercase text-slate-700 font-bold">
                Fecha de inicio/ingreso
              </p>
              <p className="uppercase text-slate-700">{fechaFormateadaTwo}</p>
            </div>

            <div className="flex gap-2">
              <p className="uppercase text-slate-700 font-bold">Antiguedad</p>
              <p className="uppercase text-slate-700">
                {datos.antiguedad} Años
              </p>
            </div>

            <div className="flex gap-2">
              <p className="uppercase text-slate-700 font-bold">Banco</p>
              <p className="uppercase text-slate-700">
                {" "}
                -
                {Number(datos.otros).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>
            </div>

            <div className="flex gap-2">
              <p className="uppercase text-slate-700 font-bold">Descuentos</p>
              <p className="uppercase text-slate-700">
                {" "}
                -{" "}
                {Number(datos.descuento).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>
            </div>

            <div className="flex gap-2">
              <p className="uppercase text-slate-700 font-bold">Otros</p>
              <p className="uppercase text-slate-700">
                {" "}
                {Number(datos.banco).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>
            </div>

            <div className="flex gap-2">
              <p className="uppercase text-slate-700 font-bold">
                Premio asistencia
              </p>
              <p className="uppercase text-slate-700">
                +
                {Number(datos.premio_asistencia).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>
            </div>

            {datos.tipo_fabrica !== "administracion" &&
              datos.tipo_fabrica !== "clubes" && (
                <div className="flex gap-2">
                  <p className="uppercase text-slate-700 font-bold">
                    {datos.tipo_fabrica !== "administracion" &&
                      datos.tipo_fabrica !== "clubes" &&
                      "Premio produccion"}
                  </p>
                  <p className="uppercase text-slate-700">
                    {datos.tipo_fabrica !== "administracion" &&
                    datos.tipo_fabrica !== "gerencia" &&
                    datos.tipo_fabrica !== "clubes" ? (
                      <p>
                        +
                        {Number(datos.premio_produccion).toLocaleString(
                          "es-AR",
                          {
                            style: "currency",
                            currency: "ARS",
                          }
                        )}
                      </p>
                    ) : (
                      ""
                    )}
                  </p>
                </div>
              )}

            <div className="flex gap-2">
              <p className="uppercase text-slate-700 font-bold">Comida</p>
              <p className="uppercase text-slate-700">
                +
                {Number(datos.comida_produccion).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>
            </div>

            <div className="flex gap-2">
              <p className="uppercase text-slate-700 font-bold">Mes 5 normal</p>
              <p className="uppercase text-slate-700">
                {" "}
                {Number(datos.quincena_del_cinco).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>
            </div>

            {datos.tipo !== "mensual" && (
              <div className="flex gap-2">
                <p className="uppercase text-slate-700 font-bold">
                  mes 20 normal
                </p>
                <p className="uppercase text-slate-700">
                  {" "}
                  {Number(datos.quincena_del_veinte).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <p className="uppercase text-slate-700 font-bold">
                mes 5 total neto
              </p>
              <p className="uppercase text-slate-700">
                {" "}
                {Number(datos.total_quincena).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>
            </div>

            {datos.tipo !== "mensual" && (
              <div className="flex gap-2">
                <p className="uppercase text-slate-700 font-bold">
                  mes 20 total neto
                </p>
                <p className="uppercase text-slate-700">
                  {" "}
                  {Number(datos.total_quincena_veinte).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <p className="uppercase text-slate-700 font-bold">
                Sueldo Neto final
              </p>
              <p className="uppercase text-slate-700">
                {" "}
                {Number(datos.total_final).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 flex gap-2">
        <button className="bg-black text-white rounded-xl py-2 px-6 hover:shadow-md transiton-all ease-in-out duration-200">
          <PDFDownloadLink document={<ImprimirComprobante datos={datos} />}>
            Descargar Comprobante Empleado
          </PDFDownloadLink>
        </button>

        <button
          onClick={() => {
            handleEliminar();
          }}
          className="bg-red-500 text-white rounded-xl py-2 px-6 hover:shadow-md transiton-all ease-in-out duration-200"
        >
          Eliminar empleado
        </button>
      </div>
    </section>
  );
};

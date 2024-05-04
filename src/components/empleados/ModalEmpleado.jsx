import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useEmpleadosContext } from "../../context/EmpleadosProvider";
import {
  eliminarEmpleado,
  obtenerUnicoEmpleado,
} from "../../api/empleados.api";
import { toast } from "react-toastify";

export const ModalEmpleado = ({ isOpenEdit, closeModalEdit, obtenerId }) => {
  const [datos, setDatos] = useState([]);

  const { empleados, setEmpleados } = useEmpleadosContext();

  useEffect(() => {
    async function loadData() {
      const res = await obtenerUnicoEmpleado(obtenerId);

      setDatos(res.data);
    }

    loadData();
  }, [obtenerId]);

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

  const handleEliminar = () => {
    const res = eliminarEmpleado(obtenerId);

    const updatedTipos = empleados.filter((tipo) => tipo.id !== datos.id);

    setEmpleados(updatedTipos);

    toast.error("¡Eliminado correctamente espera 5 segundos!", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      style: {
        padding: "10px",
        borderRadius: "15px",
      },
    });

    closeModalEdit();
  };

  const [isOpen, setIsOpen] = useState(false);

  const openEliminar = () => {
    setIsOpen(true);
  };

  const closeEliminar = () => {
    setIsOpen(false);
  };

  return (
    <Menu as="div" className="z-100">
      <Transition appear show={isOpenEdit} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto scrooll-bar"
          onClose={closeModalEdit}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-10" />
          </Transition.Child>

          <div className="text-center h-full bg-white">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-white" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full h-full p-6 my-0 px-5 text-left align-middle transition-all transform bg-white rounded-none max-w-full z-[101]">
                <div
                  className="flex justify-end px-3"
                  onClick={() => closeModalEdit()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-10 h-10 bg-indigo-500 text-white cursor-pointer py-2 px-2 rounded-full"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <div className="text-base text-indigo-500 border-b-[1px] uppercase mb-2 font-semibold">
                  Empleado obtenido
                </div>

                <div className="mb-5 flex flex-col">
                  <p>
                    Observa los datos del empleado obtenido y analiza sus datos.
                  </p>
                </div>

                <div>
                  <p className="font-bold text-slate-700 mx-3">
                    Datos del empleado 🧑‍💼
                  </p>
                </div>

                <div className="h-full">
                  <div className="py-5 grid grid-cols-3 gap-3">
                    {datos.tipo === "mensual" ? (
                      <article className="flex flex-col gap-4 hover:shadow-xl shadow-lg transition-all ease-linear bg-white p-6 cursor-pointer uppercase rounded-2xl border border-gray-300">
                        <div className="inline-flex gap-2 self-end rounded-xl bg-green-100 py-2 px-2 text-green-600">
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
                            {Number(datos.total_quincena / 1000).toFixed(
                              2
                            )}%{" "}
                          </span>
                        </div>

                        <div>
                          <strong className="block text-sm font-medium text-gray-500">
                            {" "}
                            Neto a cobrar con descuentos
                          </strong>

                          <p>
                            <span className="text-2xl font-medium text-gray-900">
                              {" "}
                              {Number(datos.total_quincena).toLocaleString(
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
                              {Number(totalSumado).toLocaleString("es-AR", {
                                style: "currency",
                                currency: "ARS",
                              })}{" "}
                            </span>
                          </p>
                        </div>
                      </article>
                    ) : (
                      <article className="flex flex-col gap-4 hover:shadow-xl shadow-lg transition-all ease-linear bg-white p-6 cursor-pointer uppercase rounded-2xl border border-gray-300">
                        <div className="inline-flex gap-2 self-end rounded-xl bg-green-100 py-2 px-2 text-green-600">
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
                            {Number(datos.total_quincena / 1000).toFixed(
                              2
                            )}%{" "}
                          </span>
                        </div>

                        <div>
                          <strong className="block text-sm font-medium text-gray-500">
                            {" "}
                            Neto a cobrar el cinco
                          </strong>

                          <p>
                            <span className="text-2xl font-medium text-gray-900">
                              {" "}
                              {Number(datos.total_quincena).toLocaleString(
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
                              {Number(totalSumado).toLocaleString("es-AR", {
                                style: "currency",
                                currency: "ARS",
                              })}{" "}
                            </span>
                          </p>
                        </div>
                      </article>
                    )}

                    {datos.tipo !== "mensual" && (
                      <article className="flex flex-col gap-4 hover:shadow-xl shadow-lg transition-all ease-linear bg-white p-6 cursor-pointer uppercase rounded-2xl border border-gray-300">
                        <div className="inline-flex gap-2 self-end rounded-xl bg-green-100 py-2 px-2 text-green-600">
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
                            {Number(datos.total_quincena_veinte / 1000).toFixed(
                              2
                            )}
                            %{" "}
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
                              {Number(
                                datos.total_quincena_veinte
                              ).toLocaleString("es-AR", {
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
                    )}

                    <article className="flex flex-col gap-4 hover:shadow-xl shadow-lg transition-all ease-linear bg-white p-6 cursor-pointer uppercase rounded-2xl border border-gray-300">
                      <div className="inline-flex gap-2 self-end rounded-xl bg-indigo-100 py-2 px-2 text-indigo-600">
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
                          {Number(datos.total_final / 1000).toFixed(2)}%{" "}
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
                    <article className="flex flex-col gap-4 hover:shadow-xl shadow-lg transition-all ease-linear bg-white p-6 cursor-pointer uppercase rounded-2xl border border-gray-300">
                      <div className="inline-flex gap-2 self-end rounded-xl bg-indigo-100 py-2 px-2 text-indigo-600">
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

                        <span className="text-xs font-medium">
                          {" "}
                          {meses[mes]}{" "}
                        </span>
                      </div>

                      <div>
                        <strong className="block text-sm font-medium text-gray-500">
                          {" "}
                          Fecha del mes{" "}
                        </strong>

                        <p>
                          <span className="text-xl font-medium text-gray-900">
                            {fechaFormateada}
                          </span>
                        </p>
                      </div>
                    </article>
                  </div>

                  <div className="">
                    <div className="flex">
                      <p className="text-green-700 shadow-md shadow-gray-200 font-normal bg-green-100 py-3 px-5 rounded-xl ">
                        EMPLEADO RESUMEN{" "}
                        <span className="font-semibold">{datos.empleado}</span>
                      </p>
                    </div>

                    <div className="w-full grid grid-cols-3 gap-4 px-4 mt-5">
                      <article className="border-[1px] border-gray-300 py-2 px-4 rounded-2xl flex flex-col gap-2 hover:shadow-md transition-all ease-linear cursor-pointer">
                        <p className="text-indigo-600 font-bold underline">
                          DATOS DEL EMPLEADO
                        </p>

                        <div className="flex gap-2 text-base">
                          <p className="uppercase text-slate-700 font-bold">
                            Nombre y Apellido
                          </p>
                          <p className="uppercase text-slate-700">
                            {datos.empleado}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <p className="uppercase text-slate-700 font-bold">
                            Fabrica o Suc.
                          </p>
                          <p className="uppercase text-slate-700">
                            {datos.tipo_fabrica}
                          </p>
                        </div>
                        {datos.tipo_fabrica === "parque industrial" ||
                        datos.tipo_fabrica === "long" ? (
                          <div className="flex gap-2">
                            <p className="uppercase text-slate-700 font-bold">
                              Rol/Seccion.
                            </p>
                            <p className="uppercase text-slate-700">
                              {datos.rol}
                            </p>
                          </div>
                        ) : (
                          ""
                        )}

                        <div className="flex gap-2">
                          <p className="uppercase text-slate-700 font-bold">
                            Tipo de sueldo
                          </p>
                          <p className="uppercase text-slate-700">
                            {datos.tipo}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <p className="uppercase text-slate-700 font-bold">
                            Fecha de inicio/ingreso
                          </p>
                          <p className="uppercase text-slate-700">
                            {fechaFormateadaTwo}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <p className="uppercase text-slate-700 font-bold">
                            Antiguedad
                          </p>
                          <p className="uppercase text-slate-700">
                            {datos.antiguedad} Años
                          </p>
                        </div>
                      </article>

                      <article className="flex flex-col gap-2 hover:shadow-xl shadow-lg transition-all ease-linear bg-white p-6 cursor-pointer uppercase rounded-2xl border border-gray-300">
                        <p className="text-indigo-600 font-bold underline">
                          DESCUENTOS, PREMIOS,BANCO ,ETC
                        </p>

                        <div className="flex gap-2">
                          <p className="uppercase text-slate-700 font-bold">
                            Banco
                          </p>
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
                          <p className="uppercase text-slate-700 font-bold">
                            Descuentos
                          </p>
                          <p className="uppercase text-slate-700">
                            {datos.tipo === "mensual" ? (
                              <p>
                                -{" "}
                                {Number(datos.descuento).toLocaleString(
                                  "es-AR",
                                  {
                                    style: "currency",
                                    currency: "ARS",
                                  }
                                )}
                              </p>
                            ) : (
                              <div className="flex flex-col gap-2">
                                <p>
                                  del 5 -
                                  {Number(datos.descuento).toLocaleString(
                                    "es-AR",
                                    {
                                      style: "currency",
                                      currency: "ARS",
                                    }
                                  )}
                                </p>
                                <p>
                                  del 20 -
                                  {Number(datos.descuento_20).toLocaleString(
                                    "es-AR",
                                    {
                                      style: "currency",
                                      currency: "ARS",
                                    }
                                  )}
                                </p>
                              </div>
                            )}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <p className="uppercase text-slate-700 font-bold">
                            Otros
                          </p>
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
                            {Number(datos.premio_asistencia).toLocaleString(
                              "es-AR",
                              {
                                style: "currency",
                                currency: "ARS",
                              }
                            )}
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
                                datos.tipo_fabrica !== "clubes" ? (
                                  <p>
                                    {datos.rol === "armado" ? (
                                      ""
                                    ) : (
                                      <p>
                                        +
                                        {Number(
                                          datos.premio_produccion
                                        ).toLocaleString("es-AR", {
                                          style: "currency",
                                          currency: "ARS",
                                        })}
                                      </p>
                                    )}
                                  </p>
                                ) : (
                                  ""
                                )}
                              </p>
                            </div>
                          )}

                        <div className="flex gap-2">
                          <p className="uppercase text-slate-700 font-bold">
                            Comida
                          </p>
                          <p className="uppercase text-slate-700">
                            +
                            {Number(datos.comida_produccion).toLocaleString(
                              "es-AR",
                              {
                                style: "currency",
                                currency: "ARS",
                              }
                            )}
                          </p>
                        </div>
                      </article>

                      <article className="flex flex-col gap-2 hover:shadow-xl shadow-lg transition-all ease-linear bg-white p-6 cursor-pointer uppercase rounded-2xl border border-gray-300">
                        <p className="text-indigo-600 font-bold underline">
                          SUELDO CON ATRIBUTOS Y SIN ATRIBUTOS VER
                        </p>

                        <div className="flex gap-2">
                          <p className="uppercase text-slate-700 font-bold">
                            Mes 5 normal / SIN DESCUENTOS / PRODUCCIÓN, ETC
                          </p>
                          <p className="uppercase text-slate-700">
                            {" "}
                            {Number(datos.quincena_del_cinco).toLocaleString(
                              "es-AR",
                              {
                                style: "currency",
                                currency: "ARS",
                              }
                            )}
                          </p>
                        </div>

                        {datos.tipo !== "mensual" && (
                          <div className="flex gap-2">
                            <p className="uppercase text-slate-700 font-bold">
                              mes 20 normal / SIN DESCUENTOS / PRODUCCIÓN, ETC
                            </p>
                            <p className="uppercase text-slate-700">
                              {" "}
                              {Number(datos.quincena_del_veinte).toLocaleString(
                                "es-AR",
                                {
                                  style: "currency",
                                  currency: "ARS",
                                }
                              )}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <p className="uppercase text-slate-700 font-bold">
                            mes 5 total neto a cobrar en mano
                          </p>
                          <p className="uppercase text-slate-700">
                            {" "}
                            {Number(datos.total_quincena).toLocaleString(
                              "es-AR",
                              {
                                style: "currency",
                                currency: "ARS",
                              }
                            )}
                          </p>
                        </div>

                        {datos.tipo !== "mensual" && (
                          <div className="flex gap-2">
                            <p className="uppercase text-slate-700 font-bold">
                              mes 20 total neto a cobrar en mano
                            </p>
                            <p className="uppercase text-slate-700">
                              {" "}
                              {Number(
                                datos.total_quincena_veinte
                              ).toLocaleString("es-AR", {
                                style: "currency",
                                currency: "ARS",
                              })}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <p className="uppercase text-slate-700 font-bold">
                            Sueldo Neto final remunerado
                          </p>
                          <p className="uppercase text-slate-700">
                            {" "}
                            {Number(datos.total_final).toLocaleString("es-AR", {
                              style: "currency",
                              currency: "ARS",
                            })}
                          </p>
                        </div>
                      </article>
                    </div>
                  </div>
                  <div className="mt-10 flex gap-2">
                    <button
                      onClick={() => {
                        openEliminar();
                      }}
                      className="bg-red-100 uppercase text-red-700 rounded-2xl py-3 px-5 hover:shadow-md transiton-all ease-in-out duration-200"
                    >
                      Deseas eliminar el empleado
                    </button>
                  </div>

                  <ModalEliminar
                    isOpen={isOpen}
                    closeEliminar={closeEliminar}
                    handleEliminar={handleEliminar}
                  />

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                      onClick={closeModalEdit}
                    >
                      Cerrar Ventana
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};

const ModalEliminar = ({ isOpen, closeEliminar, handleEliminar }) => {
  return (
    <Menu as="div" className="z-50">
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeEliminar}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-[400px] p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="text-lg text-indigo-500 mb-3 border-b-[1px] uppercase">
                  DESEAS ELIMINAR EL EMPLEADO?
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => closeEliminar()}
                    type="button"
                    className="bg-indigo-500/10  py-2 px-3 rounded-xl uppercase text-center text-indigo-700 w-full"
                  >
                    No eliminar
                  </button>
                  <button
                    onClick={() => {
                      handleEliminar();
                    }}
                    type="button"
                    className="bg-red-500/10  py-2 px-3 rounded-xl uppercase text-center text-red-800 flex justify-between items-center w-full"
                  >
                    Eliminar{" "}
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
                        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};

import { useEffect, useState } from "react";
import { useIngresosContext } from "../../context/IngresosProvider";
import { ModalGuardarDatos } from "../modals/ModalGuardarDatos";
import { ToastContainer, toast } from "react-toastify";
import client from "../../api/axios";

export const TablaDeDatos = ({
  handleId,
  openModalEliminar,
  setObtenerIdTwo,
}) => {
  const { openModalEditar, resultadosFiltrados } = useIngresosContext();

  const handleIdTwo = (id) => {
    setObtenerIdTwo(id);
  };

  const itemsPerPage = 10; // Cantidad de elementos por página
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResults = resultadosFiltrados?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(resultadosFiltrados.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const downloadDataAsExcel = () => {
    const data = resultadosFiltrados.map((i) => ({
      NUMERO: i.id,
      TIPO: i.tipo.toUpperCase(),
      DETALLE: i.detalle.toUpperCase(),
      CREADOR: i.usuario.toUpperCase(),
      INGRESO: Number(i?.total).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      }),
      TOTAL: Number(i?.total).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      }),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos");
    XLSX.writeFile(wb, "datos.xlsx");
  };

  const [egresos, setEgresos] = useState(
    JSON.parse(localStorage.getItem("egresos")) || []
  );
  const [editandoIndice, setEditandoIndice] = useState(null);
  const [nuevoNumero, setNuevoNumero] = useState("");
  const [nuevoTipo, setNuevoTipo] = useState("");
  const [nuevaObs, setNuevaObs] = useState("");
  const [nuevoPorcentaje, setNuevoPorcentaje] = useState("");
  const [nuevoPresupuesto, setNuevoPresupuesto] = useState("");
  const [nuevoUtilizado, setNuevoUtilizado] = useState("");
  const [nuevaDiferencia, setNuevaDiferencia] = useState("");
  const [presupuestoAsignado, setPresupuestoAsignado] = useState("");

  // Guardar en localStorage cada vez que egresos cambie
  useEffect(() => {
    localStorage.setItem("egresos", JSON.stringify(egresos));
  }, [egresos]);

  // Arreglo para guardar el valor del presupuesto asignado
  const [presupuestoValor, setPresupuestoValor] = useState([]);

  // Efecto para cargar el presupuesto asignado del localStorage al cargar el componente
  useEffect(() => {
    const presupuestoGuardado = localStorage.getItem("presupuestoAsignado");
    if (presupuestoGuardado) {
      setPresupuestoAsignado(JSON.parse(presupuestoGuardado));
      setPresupuestoValor((prevPresupuestoValor) => [
        ...prevPresupuestoValor,
        JSON.parse(presupuestoGuardado),
      ]);
    }
  }, []); // Ejecutar solo una vez al cargar el componente

  // Función para guardar el presupuesto asignado en el localStorage y actualizar el estado
  const handlePresupuestoChange = (e) => {
    const valor = e.target.value;
    setPresupuestoAsignado(valor);
    setPresupuestoValor((prevPresupuestoValor) => [
      ...prevPresupuestoValor,
      valor,
    ]);
    localStorage.setItem("presupuestoAsignado", JSON.stringify(valor));
  };

  const agregarFila = () => {
    const nuevaFila = {
      numero: nuevoNumero,
      tipo: nuevoTipo,
      obs: nuevaObs,
      porcentaje: nuevoPorcentaje,
      presupuesto: nuevoPresupuesto,
      utilizado: nuevoUtilizado,
      diferencia: nuevaDiferencia,
    };
    setEgresos([...egresos, nuevaFila]);
    limpiarCampos();
  };

  const editarFila = (index) => {
    setEditandoIndice(index);
    const filaEditada = egresos[index];
    setNuevoNumero(filaEditada.numero);
    setNuevoTipo(filaEditada.tipo);
    setNuevaObs(filaEditada.obs);
    setNuevoPorcentaje(filaEditada.porcentaje);
    setNuevoPresupuesto(filaEditada.presupuesto);
    setNuevoUtilizado(filaEditada.utilizado);
    setNuevaDiferencia(filaEditada.diferencia);
  };

  const actualizarFila = (index) => {
    const nuevasFilas = [...egresos];
    nuevasFilas[index] = {
      numero: nuevoNumero,
      tipo: nuevoTipo,
      obs: nuevaObs,
      porcentaje: nuevoPorcentaje,
      presupuesto: nuevoPresupuesto,
      utilizado: nuevoUtilizado,
      diferencia: nuevaDiferencia,
    };
    setEgresos(nuevasFilas);
    limpiarCampos();
    setEditandoIndice(null);
  };

  const eliminarFila = (index) => {
    const nuevasFilas = [...egresos];
    nuevasFilas.splice(index, 1);
    setEgresos(nuevasFilas);
  };

  const limpiarCampos = () => {
    setNuevoNumero("");
    setNuevoTipo("");
    setNuevaObs("");
    setNuevoPorcentaje("");
    setNuevoPresupuesto("");
    setNuevoUtilizado("");
    setNuevaDiferencia("");
  };

  const sumaPorcentajes = egresos?.reduce(
    (total, egreso) => total + parseFloat(egreso?.porcentaje),
    0
  );

  const sumaUtilizado = egresos.reduce(
    (total, egreso) => total + parseFloat(egreso.utilizado),
    0
  );

  const resultadoCalculos = egresos.reduce((resultados, egreso) => {
    const resultado = Number(
      (egreso.porcentaje * presupuestoAsignado) / 100 - egreso.utilizado
    );
    resultados.push(resultado);
    return resultados;
  }, []);

  const sumaTotal = resultadoCalculos.reduce(
    (total, resultado) => total + resultado,
    0
  );

  const sumaTotalPositivos = resultadoCalculos.reduce((total, resultado) => {
    if (resultado > 0) {
      return total + resultado;
    }
    return total;
  }, 0);

  const onSubmit = async () => {
    const datos = {
      egresos: JSON.stringify(egresos), // Convertir a formato JSON
      presupuestoasignado: presupuestoAsignado,
    };

    const datosCanjes = {
      datos: "[]",
    };

    try {
      const res = await client.post("/crear-datos", datos);

      const resCanjes = await client.post("/crear-canjes", datosCanjes);

      toast.success("¡Datos creados correctamente!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        theme: "light",
        style: {
          padding: "10px",
          borderRadius: "15px",
          backgroundColor: "rgb(240 253 244)",
          color: "rgb(21 128 61)",
        },
      });
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);

      toast.error("¡Hubo un error tenes que volver a inicio!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        theme: "light",
        style: {
          padding: "10px",
          borderRadius: "15px",
          backgroundColor: "rgb(254 226 226)",
          color: "rgb(153 27 27)",
        },
      });
    }
  };

  const [guradarDatosModal, setGuardarDatosModal] = useState(false);

  const openGuardarDatos = () => {
    setGuardarDatosModal(true);
  };

  const closeGuardarDatos = () => {
    setGuardarDatosModal(false);
  };

  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index) => {
    if (draggedIndex === null || index === draggedIndex) return;
    const newEgresos = [...egresos];
    const draggedItem = newEgresos[draggedIndex];
    newEgresos.splice(draggedIndex, 1);
    newEgresos.splice(index, 0, draggedItem);
    setEgresos(newEgresos);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="h-full min-h-full max-h-full">
      <ToastContainer />

      <div className="font-semibold text-xl">
        Generar los datos de la estadistica del mes 🖐️
      </div>
      <div className="mt-6 mb-10 grid grid-cols-4 gap-5">
        <article className="cursor-pointer flex justify-between items-start rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-xl shadow-lg border-none transition-all ease-in-out">
          <div className="flex gap-4 items-center">
            <span className="rounded-full bg-green-100 p-4 text-green-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </span>

            <div>
              <p className="text-2xl font-medium text-gray-900">
                {" "}
                {Number(presupuestoAsignado).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>

              <p className="text-sm text-gray-600 underline">
                PRESUPUESTO ASIGNADO
              </p>
            </div>
          </div>
          <div className="inline-flex gap-2 rounded-xl bg-green-100 p-2 text-green-600">
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

            <span className="text-sm font-bold"> {sumaPorcentajes}% </span>
          </div>
        </article>

        <article className="cursor-pointer flex justify-between items-start rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-xl shadow-lg border-none transition-all ease-in-out">
          <div className="flex gap-4 items-center">
            <span className="rounded-full bg-red-100 p-4 text-red-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </span>

            <div>
              <p className="text-2xl font-medium text-red-700">
                {" "}
                -
                {Number(sumaUtilizado).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>

              <p className="text-sm text-gray-600 underline">UTILIZADO REAL</p>
            </div>
          </div>
          <div className="inline-flex gap-2 rounded-xl bg-red-100 p-2 text-red-600">
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

            <span className="text-sm font-bold"> - {sumaPorcentajes}% </span>
          </div>
        </article>

        <article className="cursor-pointer flex justify-between items-start rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-xl shadow-lg border-none transition-all ease-in-out">
          <div className="flex gap-4 items-center">
            <span className="rounded-full bg-red-100 p-4 text-red-700">
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
                  d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
                />
              </svg>
            </span>

            <div>
              <p className="text-2xl font-medium text-red-700">
                {sumaTotal.toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>

              <p className="text-sm text-gray-600 underline">
                PERDIDAS/DIFERENCIA
              </p>
            </div>
          </div>
          <div className="inline-flex gap-2 rounded-xl bg-red-100 p-2 text-red-600">
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

            <span className="text-sm font-bold"> - {sumaPorcentajes}% </span>
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
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </span>

            <div>
              <p className="text-2xl font-medium text-slate-800">
                {sumaTotalPositivos.toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>

              <p className="text-sm text-gray-600 underline">
                NO PERDIDAS/DIFERENCIA
              </p>
            </div>
          </div>
          <div className="inline-flex gap-2 rounded-xl bg-green-100 p-2 text-green-600">
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

            <span className="text-sm font-bold"> - {sumaPorcentajes}% </span>
          </div>
        </article>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        <div>
          <p className="text-sm uppercase text-slate-700">
            PORCENTAJE VER SI SE PASA DEL 100%
          </p>
        </div>
        <div className="flex">
          <p className="font-bold bg-indigo-500 rounded-xl py-2 px-4 text-white mr-2">
            {sumaPorcentajes || 0}%
          </p>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl mt-5 hover:shadow-md transition-all ease-linear cursor-pointer bg-white shadow-lg">
        <table className="min-w-full divide-y-1 divide-gray-200 bg-white text-sm">
          <thead>
            <tr className="border-b-[1px]">
              <th className="py-4 px-2 uppercase text-sm text-slate-800 font-bold text-left w-[100px]">
                NUM °
              </th>
              <th className="py-4 px-2 uppercase text-sm text-slate-800 font-bold text-left">
                Tipo de egreso
              </th>
              <th className="py-4 px-2 uppercase text-sm text-slate-800 font-bold text-left">
                Obs.
              </th>
              <th className="py-4 px-2 uppercase text-sm text-slate-800 font-bold text-left">
                %
              </th>
              <th className="py-4 px-2 uppercase text-sm text-slate-800 font-bold text-left">
                Presupuesto
              </th>
              <th className="py-4 px-2 uppercase text-sm text-slate-800 font-bold text-left">
                Utilizado Real
              </th>
              <th className="py-4 px-2 uppercase text-sm text-slate-800 font-bold text-left">
                Diferencia
              </th>
              <th className="py-4 px-2 uppercase text-sm text-slate-800 font-bold text-left">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-left">
            {egresos.map((egreso, index) => (
              <tr
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={() => handleDragOver(index)}
                onDragEnd={handleDragEnd}
                className={index === draggedIndex ? "bg-gray-100" : ""}
                // className="hover:bg-slate-100 transition-all ease-in-out duration-200 cursor-pointer"
              >
                <td className="py-6 px-3 text-sm text-left text-slate-700 uppercase w-[100px]">
                  {editandoIndice === index ? (
                    <input
                      className="bg-white rounded-xl py-1 px-1 border-slate-300 border-[1px] w-[50px] text-center"
                      type="text"
                      value={nuevoNumero}
                      onChange={(e) => setNuevoNumero(e.target.value)}
                    />
                  ) : (
                    egreso.numero
                  )}
                </td>
                <td className="py-6 px-3 text-sm text-left text-slate-700 uppercase">
                  {editandoIndice === index ? (
                    <input
                      className="bg-white rounded-xl py-1 px-3 border-slate-300 border-[1px]"
                      type="text"
                      value={nuevoTipo}
                      onChange={(e) => setNuevoTipo(e.target.value)}
                    />
                  ) : (
                    egreso.tipo
                  )}
                </td>
                <td className="py-6 px-3 text-sm text-left text-slate-700 uppercase">
                  {editandoIndice === index ? (
                    <input
                      className="bg-white rounded-xl py-1 px-3 border-slate-300 border-[1px]"
                      type="text"
                      value={nuevaObs}
                      onChange={(e) => setNuevaObs(e.target.value)}
                    />
                  ) : (
                    egreso.obs
                  )}
                </td>
                <td className="py-6 px-3 text-sm text-left text-slate-700 uppercase">
                  {editandoIndice === index ? (
                    <input
                      className="bg-white rounded-xl py-1 border-slate-300 border-[1px] w-[60px] text-center"
                      type="text"
                      value={nuevoPorcentaje}
                      onChange={(e) => setNuevoPorcentaje(e.target.value)}
                    />
                  ) : (
                    `${egreso.porcentaje}%`
                  )}
                </td>
                <td className="py-6 px-3 text-sm text-left text-slate-700 font-bold">
                  {editandoIndice === index ? (
                    // <input
                    //   className="bg-white rounded-xl py-1 px-3 border-slate-300 border-[1px]"
                    //   type="text"
                    //   value={nuevoPresupuesto}
                    //   onChange={(e) => setNuevoPresupuesto(e.target.value)}
                    // />
                    <p></p>
                  ) : (
                    // Number(egreso.presupuesto).toLocaleString("es-AR", {
                    //   style: "currency",
                    //   currency: "ARS",
                    // })

                    `${Number(
                      (egreso.porcentaje * presupuestoAsignado) / 100
                    ).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}`
                  )}
                </td>
                <td className="py-6 px-3 text-sm text-left text-slate-700 font-bold">
                  {editandoIndice === index ? (
                    <input
                      className="bg-white rounded-xl py-1 px-3 border-slate-300 border-[1px]"
                      type="text"
                      value={nuevoUtilizado}
                      onChange={(e) => setNuevoUtilizado(e.target.value)}
                    />
                  ) : (
                    Number(egreso.utilizado).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })
                  )}
                </td>
                <td className="py-6 px-3 text-sm text-left text-slate-700">
                  {editandoIndice === index ? (
                    <p></p>
                  ) : (
                    <span
                      className={
                        Number(
                          Number(
                            (egreso.porcentaje * presupuestoAsignado) / 100
                          ) - egreso.utilizado
                        ) < 0
                          ? "text-red-700 font-bold"
                          : "text-green-600 font-bold"
                      }
                    >
                      {Number(
                        Number(
                          (egreso.porcentaje * presupuestoAsignado) / 100
                        ) - egreso.utilizado
                      ).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })}
                    </span>
                  )}
                </td>
                <td className="space-x-2 gap-2">
                  {editandoIndice === index ? (
                    <>
                      <button
                        className="bg-green-500 py-2 px-3 rounded-xl text-white uppercase font-bold"
                        onClick={() => actualizarFila(index)}
                      >
                        Guardar
                      </button>
                      <button
                        className="bg-red-500/20 py-2 px-3 rounded-xl text-red-700 uppercase font-bold"
                        onClick={() => setEditandoIndice(null)}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => editarFila(index)}
                        className="bg-indigo-500 py-2 px-3 rounded-xl text-white uppercase font-bold"
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500/20 py-2 px-3 rounded-xl text-red-700 uppercase font-bold"
                        onClick={() => eliminarFila(index)}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-5 mx-5 mb-5 py-2">
          <p className="text-left text-slate-800 uppercase text-sm">
            Asignar presupuesto
          </p>
          <div className="flex gap-4 items-center mt-2">
            <input
              className="bg-white border-slate-300 border-[1px] py-2 px-5 rounded-xl shadow"
              type="text"
              value={presupuestoAsignado}
              onChange={handlePresupuestoChange}
            />
            <p className="bg-indigo-500 py-2 px-2 rounded-xl text-white font-semibold text-sm">
              {Number(presupuestoAsignado).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}
            </p>
          </div>
        </div>
        <form
          className="py-3 px-5 rounded-xl border-[1px] mb-6 mx-5 flex gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            agregarFila();
          }}
        >
          <div className="flex gap-2 items-center">
            <label className="uppercase text-sm" htmlFor="nuevo-numero">
              Numero:
            </label>
            <input
              className="rounded-xl border-[1px] border-slate-200 shadow py-1 px-5 w-[100px]"
              type="text"
              id="nuevo-numero"
              value={nuevoNumero}
              onChange={(e) => setNuevoNumero(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="uppercase text-sm" htmlFor="nuevo-tipo">
              Tipo de Egreso:
            </label>
            <input
              className="rounded-xl border-[1px] border-slate-200 shadow py-1 px-5"
              type="text"
              id="nuevo-tipo"
              value={nuevoTipo}
              onChange={(e) => setNuevoTipo(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="uppercase text-sm" htmlFor="nueva-obs">
              Observaciones:
            </label>
            <input
              className="rounded-xl border-[1px] border-slate-200 shadow py-1 px-5"
              type="text"
              id="nueva-obs"
              value={nuevaObs}
              onChange={(e) => setNuevaObs(e.target.value)}
            />
          </div>
          {/* Agregar más campos según sea necesario */}
          <button
            className="bg-indigo-500 py-2 px-2 text-white uppercase rounded-xl text-sm shadow font-semibold"
            type="submit"
          >
            Agregar Fila
          </button>
        </form>

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

      <div className="py-10">
        <button
          onClick={() => openGuardarDatos()}
          className="bg-indigo-500 py-3 px-6 rounded-full text-white font-semibold shadow"
          type="button"
        >
          Guardar los datos de la estadistica
        </button>
      </div>

      <ModalGuardarDatos
        closeModalGuardarDatos={closeGuardarDatos}
        guardarDatosModal={guradarDatosModal}
        onSubmit={onSubmit}
      />
    </div>
  );
};

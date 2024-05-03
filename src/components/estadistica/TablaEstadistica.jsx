import { useEffect, useState } from "react";
import { obtenerMes } from "../../../middlewares/mes";
import { ModalGuardarDatos } from "../modals/ModalGuardarDatos";
import { ToastContainer, toast } from "react-toastify";
import { TablaDescargarPdf } from "./TablaDescargarPdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import client from "../../api/axios";

export const TablaEstadistica = () => {
  const [fechaInicio, setFechaInicio] = useState(
    localStorage.getItem("fechaInicio")
  );
  const [fechaFin, setFechaFin] = useState(localStorage.getItem("fechaFin"));
  const [loading, setLoading] = useState(false);
  const [egresos, setEgresos] = useState(
    JSON.parse(localStorage.getItem("egresos-dos")) || []
  );
  const [canjes, setCanjes] = useState(
    JSON.parse(localStorage.getItem("canjes")) || []
  );

  const [editandoIndice, setEditandoIndice] = useState(null);
  const [nuevoNumero, setNuevoNumero] = useState("");
  const [nuevoTipo, setNuevoTipo] = useState("");
  const [nuevaObs, setNuevaObs] = useState("");
  const [nuevoPorcentaje, setNuevoPorcentaje] = useState("");
  const [nuevoPresupuesto, setNuevoPresupuesto] = useState("");
  const [nuevoUtilizado, setNuevoUtilizado] = useState("");
  const [nuevaDiferencia, setNuevaDiferencia] = useState("");

  const [canjesNumero, setCanjesNumero] = useState("");
  const [canjesTipo, setCanjesTipo] = useState("");
  const [canjesObs, setCanjesObs] = useState("");
  const [canjesUtilizado, setCanjesUtilizado] = useState("");
  const [editandoIndiceCanjes, setEditandoIndiceCanjes] = useState(null);

  const [presupuestoAsignado, setPresupuestoAsignado] = useState(
    localStorage.getItem("presupuestoAsignado-dos" || 0)
  );

  const [idObtenida, setIdObtenida] = useState(
    localStorage.getItem("idObtenida")
  );

  const [idObtenidaCanjes, setIdObtenidaCanjes] = useState(
    localStorage.getItem("idObtenidaCanjes")
  );

  const [fechaObtenida, setFechaObtenida] = useState(
    localStorage.getItem("fechaObtenida")
  );

  useEffect(() => {
    localStorage.setItem("egresos-dos", JSON.stringify(egresos));
  }, [egresos]);

  useEffect(() => {
    localStorage.setItem("canjes", JSON.stringify(canjes));
  }, [canjes]);

  useEffect(() => {
    localStorage.setItem("presupuestoAsignado-dos", presupuestoAsignado);
  }, [presupuestoAsignado]);

  useEffect(() => {
    localStorage.setItem("fechaObtenida", fechaObtenida);
  }, [fechaObtenida]);

  useEffect(() => {
    localStorage.setItem("idObtenida", idObtenida);
  }, [idObtenida]);

  useEffect(() => {
    localStorage.setItem("idObtenidaCanjes", idObtenidaCanjes);
  }, [idObtenidaCanjes]);

  useEffect(() => {
    localStorage.setItem("fechaInicio", fechaInicio);
    localStorage.setItem("fechaFin", fechaFin);
  }, [fechaInicio, fechaFin]);

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

      const response = await client.post("/datos/rango-fechas", {
        fechaInicio,
        fechaFin,
      });

      const responseCanjes = await client.post("/canjes/rango-fechas", {
        fechaInicio,
        fechaFin,
      });

      const egresosArray = response?.data[0]?.egresos;

      const canjesArray = responseCanjes?.data[0]?.datos;

      setEgresos(egresosArray || []);
      setPresupuestoAsignado(response?.data[0]?.presupuestoasignado);
      setFechaObtenida(response?.data[0]?.created_at);
      setIdObtenida(response?.data[0]?.id);
      setCanjes(canjesArray || []);
      setIdObtenidaCanjes(responseCanjes?.data[0]?.id);
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

  const agregarFilaCanjes = () => {
    const nuevaFila = {
      numero: canjesNumero,
      tipo: canjesTipo,
      obs: canjesObs,
      utilizado: canjesUtilizado,
    };
    setCanjes([...canjes, nuevaFila]);
    limpiarCamposCanjes();
  };

  const editarFilaCanjes = (index) => {
    setEditandoIndiceCanjes(index);
    const filaEditada = canjes[index];
    setCanjesNumero(filaEditada.numero);
    setCanjesTipo(filaEditada.tipo);
    setCanjesObs(filaEditada.obs);
    setCanjesUtilizado(filaEditada.utilizado);
  };

  const actualizarFilaCanjes = (index) => {
    const nuevasFilas = [...canjes];
    nuevasFilas[index] = {
      numero: canjesNumero,
      tipo: canjesTipo,
      obs: canjesObs,
      utilizado: canjesUtilizado,
    };

    setCanjes(nuevasFilas);
    limpiarCamposCanjes();
    setEditandoIndiceCanjes(null);
  };

  const eliminarFilaCanjes = (index) => {
    const nuevasFilas = [...canjes];
    nuevasFilas.splice(index, 1);
    setCanjes(nuevasFilas);
  };

  const limpiarCamposCanjes = () => {
    setCanjesNumero("");
    setCanjesTipo("");
    setCanjesObs("");
    setCanjesUtilizado("");
  };

  console.log("canjes", canjes);

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
      datos: JSON.stringify(canjes), // Convertir a formato JSON
    };

    try {
      const res = await client.put(`/editar-datos/${idObtenida}`, datos);

      const resCanjes = await client.put(
        `/editar-canjes/${idObtenidaCanjes}`,
        datosCanjes
      );

      toast.success("¡Datos Guardados Correctamente!", {
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

      setTimeout(() => {
        closeGuardarDatos();
      }, 500);
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

  const [draggedIndexCanjes, setDraggedIndexCanjes] = useState(null);

  const handleDragStartCanjes = (index) => {
    setDraggedIndexCanjes(index);
  };

  const handleDragOverCanjes = (index) => {
    if (draggedIndexCanjes === null || index === draggedIndexCanjes) return;
    const newCanjes = [...canjes];
    const draggedItem = newCanjes[draggedIndexCanjes];
    newCanjes.splice(draggedIndexCanjes, 1);
    newCanjes.splice(index, 0, draggedItem);
    setCanjes(newCanjes);
    setDraggedIndexCanjes(index);
  };

  const handleDragEndCanjes = () => {
    setDraggedIndexCanjes(null);
  };

  const totalUtilizado = canjes?.reduce((accumulator, currentValue) => {
    return accumulator + parseInt(currentValue?.utilizado, 10);
  }, 0);

  return (
    <div className="h-full min-h-full max-h-full">
      <ToastContainer />
      <div className="font-semibold text-xl">
        Filtrar los datos de la estadistica del mes generadas 🖐️
      </div>
      <div className="mt-10 mb-10">
        <div className="flex gap-6 items-center">
          <div className="flex gap-2 items-center">
            <label className="text-base text-slate-700 uppercase font-semibold">
              Fecha de inicio
            </label>
            <input
              className="text-sm bg-white py-2 px-3 rounded-2xl shadow-lg cursor-pointer text-slate-700 outline-none"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-base text-slate-700 uppercase font-semibold">
              Fecha de fin
            </label>
            <input
              className="text-sm bg-white py-2 px-3 rounded-2xl shadow-lg cursor-pointer text-slate-700 outline-none"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>

          <button
            onClick={buscarIngresosPorFecha}
            className="text-white capitalize text-sm bg-indigo-500 px-6 py-3 rounded-full shadow-lg font-semibold"
          >
            Buscar estadistica
          </button>
        </div>
      </div>

      {loading ? (
        <Skeleton />
      ) : (
        <>
          <div className="mt-6 mb-10 grid grid-cols-4 gap-5">
            <article className="cursor-pointer flex justify-between items-start rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-xl shadow-lg border-none transition-all ease-in-out relative">
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
                  <p className="text-2xl font-bold text-gray-900">
                    {" "}
                    {Number(presupuestoAsignado || 0).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </p>

                  <p className="text-sm text-gray-600 underline">
                    PRESUPUESTO ASIGNADO
                  </p>
                </div>
              </div>
              <div className="inline-flex gap-2 rounded-xl bg-green-100 p-2 text-green-600 absolute top-[-14px] right-8">
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

                <span className="text-sm font-bold">
                  {" "}
                  {sumaPorcentajes || 0}%{" "}
                </span>
              </div>
            </article>

            <article className="cursor-pointer flex justify-between items-start rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-xl shadow-lg border-none transition-all ease-in-out relative">
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
                  <p className="text-2xl font-bold text-red-700">
                    {" "}
                    -
                    {Number(
                      Number(sumaUtilizado) + Number(totalUtilizado)
                    ).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </p>

                  <p className="text-sm text-gray-600 underline">
                    UTILIZADO REAL
                  </p>
                </div>
              </div>
              <div className="inline-flex gap-2 rounded-xl bg-red-100 p-2 text-red-600 absolute top-[-14px] right-8">
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

                <span className="text-sm font-bold">
                  {" "}
                  - {Number(sumaUtilizado / 1000000000).toFixed(2)}%{" "}
                </span>
              </div>
            </article>

            <article className="cursor-pointer flex justify-between items-start rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-xl shadow-lg border-none transition-all ease-in-out relative">
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
                  <p className="text-2xl font-bold text-red-700">
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
              <div className="inline-flex gap-2 rounded-xl bg-red-100 p-2 text-red-600 absolute top-[-14px] right-8">
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

                <span className="text-sm font-bold">
                  {" "}
                  {Number(sumaTotal / 1000000).toFixed(2)}%{" "}
                </span>
              </div>
            </article>

            <article className="cursor-pointer flex justify-between items-start rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-xl shadow-lg border-none transition-all ease-in-out relative">
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
                  <p className="text-2xl font-bold text-slate-800">
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
              <div className="inline-flex gap-2 rounded-xl bg-green-100 p-2 text-green-600 absolute top-[-14px] right-8">
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

                <span className="text-sm font-bold">
                  {" "}
                  {Number(sumaTotalPositivos / 1000000).toFixed(2)}%{" "}
                </span>
              </div>
            </article>

            <article className="cursor-pointer flex justify-between items-start rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-xl shadow-lg border-none transition-all ease-in-out relative">
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
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                  </svg>
                </span>

                <div>
                  <p className="text-2xl text-slate-800 uppercase font-bold">
                    {obtenerMes(fechaObtenida)}
                  </p>

                  <p className="text-sm text-gray-600 underline">
                    FECHA OBTENIDA
                  </p>
                </div>
              </div>
              <div className="inline-flex gap-2 rounded-xl bg-green-100 p-2 text-green-600 absolute top-[-14px] right-8">
                <span className="text-sm font-bold uppercase">
                  {obtenerMes(fechaObtenida && "11-02-2024")}
                </span>
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
                {sumaPorcentajes}%
              </p>
            </div>
          </div>
          <div className="overflow-x-auto rounded-2xl cursor-pointer shadow-lg mt-5 hover:shadow-md transition-all ease-in-out bg-white">
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
                    <td className="py-6 px-3 text-sm text-left text-slate-700 uppercase w-[300px]">
                      {editandoIndice === index ? (
                        <textarea
                          className="bg-white rounded-xl py-1 px-3 border-slate-300 border-[1px]"
                          type="text"
                          value={nuevoTipo}
                          onChange={(e) => setNuevoTipo(e.target.value)}
                        />
                      ) : (
                        egreso.tipo
                      )}
                    </td>
                    <td className="py-6 px-3 text-sm text-left text-slate-700 uppercase max-w-[150px]">
                      {editandoIndice === index ? (
                        <textarea
                          className="bg-white rounded-xl py-1 px-3 border-slate-300 border-[1px]"
                          type="text"
                          value={nuevaObs}
                          onChange={(e) => setNuevaObs(e.target.value)}
                        />
                      ) : (
                        <div className="break-all">{egreso.obs}</div>
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
                  onChange={(e) => setPresupuestoAsignado(e.target.value)}
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
          </div>

          {/* tabla de canjes */}

          <div className="mt-6 flex">
            <p className="text-indigo-600 bg-indigo-100 py-3 px-5 rounded-2xl font-bold ">
              TABLA DE CANJES
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl cursor-pointer shadow-lg mt-5 hover:shadow-md transition-all ease-in-out bg-white">
            <table className="min-w-full divide-y-1 divide-gray-200 bg-white text-sm">
              <thead>
                <tr className="border-b-[1px]">
                  <th className="py-4 px-2 uppercase text-sm text-slate-800 font-bold text-left w-[100px]">
                    NUM °
                  </th>
                  <th className="py-4 px-2 uppercase text-sm text-slate-800 font-bold text-left">
                    Tipo de canje
                  </th>
                  <th className="py-4 px-2 uppercase text-sm text-slate-800 font-bold text-left">
                    Obs.
                  </th>
                  <th className="py-4 px-2 uppercase text-sm text-slate-800 font-bold text-left">
                    Utilizado en cajes
                  </th>
                  <th className="py-4 px-2 uppercase text-sm text-slate-800 font-bold text-left">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-left">
                {canjes.map((canjes, index) => (
                  <tr
                    key={index}
                    draggable
                    onDragStart={() => handleDragStartCanjes(index)}
                    onDragOver={() => handleDragOverCanjes(index)}
                    onDragEnd={handleDragEndCanjes}
                    className={
                      index === draggedIndexCanjes ? "bg-gray-100" : ""
                    }
                    // className="hover:bg-slate-100 transition-all ease-in-out duration-200 cursor-pointer"
                  >
                    <td className="py-6 px-3 text-sm text-left text-slate-700 uppercase w-[100px]">
                      {editandoIndiceCanjes === index ? (
                        <input
                          className="bg-white rounded-xl py-1 px-1 border-slate-300 border-[1px] w-[50px] text-center"
                          type="text"
                          value={canjesNumero}
                          onChange={(e) => setCanjesNumero(e.target.value)}
                        />
                      ) : (
                        canjes.numero
                      )}
                    </td>
                    <td className="py-6 px-3 text-sm text-left text-slate-700 uppercase">
                      {editandoIndiceCanjes === index ? (
                        <textarea
                          className="bg-white rounded-xl py-1 px-3 border-slate-300 border-[1px]"
                          type="text"
                          value={canjesTipo}
                          onChange={(e) => setCanjesTipo(e.target.value)}
                        />
                      ) : (
                        canjes.tipo
                      )}
                    </td>
                    <td className="py-6 px-3 text-sm text-left text-slate-700 uppercase">
                      {editandoIndiceCanjes === index ? (
                        <textarea
                          className="bg-white rounded-xl py-1 px-3 border-slate-300 border-[1px]"
                          type="text"
                          value={canjesObs}
                          onChange={(e) => setCanjesObs(e.target.value)}
                        />
                      ) : (
                        canjes.obs
                      )}
                    </td>

                    <td className="py-6 px-3 text-sm text-left text-slate-700 font-bold">
                      {editandoIndiceCanjes === index ? (
                        <input
                          className="bg-white rounded-xl py-1 px-3 border-slate-300 border-[1px]"
                          type="text"
                          value={canjesUtilizado}
                          onChange={(e) => setCanjesUtilizado(e.target.value)}
                        />
                      ) : (
                        Number(canjes.utilizado).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })
                      )}
                    </td>

                    <td className="space-x-2 gap-2">
                      {editandoIndiceCanjes === index ? (
                        <>
                          <button
                            className="bg-green-500 py-2 px-3 rounded-xl text-white uppercase font-bold"
                            onClick={() => actualizarFilaCanjes(index)}
                          >
                            Guardar
                          </button>
                          <button
                            className="bg-red-500/20 py-2 px-3 rounded-xl text-red-700 uppercase font-bold"
                            onClick={() => setEditandoIndiceCanjes(null)}
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => editarFilaCanjes(index)}
                            className="bg-indigo-500 py-2 px-3 rounded-xl text-white uppercase font-bold"
                          >
                            Editar
                          </button>
                          <button
                            className="bg-red-500/20 py-2 px-3 rounded-xl text-red-700 uppercase font-bold"
                            onClick={() => eliminarFilaCanjes(index)}
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
            <form
              className="py-3 px-5 rounded-xl border-[1px] mb-6 mx-5 flex gap-5 mt-10"
              onSubmit={(e) => {
                e.preventDefault();
                agregarFilaCanjes();
              }}
            >
              <div className="flex gap-2 items-center">
                <label className="uppercase text-sm" htmlFor="nuevo-numero-dos">
                  Numero:
                </label>
                <input
                  className="rounded-xl border-[1px] border-slate-200 shadow py-1 px-5 w-[100px]"
                  type="text"
                  id="nuevo-numero-dos"
                  value={canjesNumero}
                  onChange={(e) => setCanjesNumero(e.target.value)}
                />
              </div>
              <div className="flex gap-2 items-center">
                <label className="uppercase text-sm" htmlFor="nuevo-tipo-dos">
                  Tipo de canje:
                </label>
                <input
                  className="rounded-xl border-[1px] border-slate-200 shadow py-1 px-5"
                  type="text"
                  id="nuevo-numero-tipo"
                  value={canjesTipo}
                  onChange={(e) => setCanjesTipo(e.target.value)}
                />
              </div>
              <div className="flex gap-2 items-center">
                <label className="uppercase text-sm" htmlFor="nueva-obs">
                  Observaciones canjes:
                </label>
                <input
                  className="rounded-xl border-[1px] border-slate-200 shadow py-1 px-5"
                  type="text"
                  id="nueva-obs"
                  value={canjesObs}
                  onChange={(e) => setCanjesObs(e.target.value)}
                />
              </div>
              {/* Agregar más campos según sea necesario */}
              <button
                className="bg-indigo-500 py-2 px-2 text-white uppercase rounded-xl text-sm shadow font-semibold"
                type="submit"
              >
                Agregar Fila Canje
              </button>
            </form>
          </div>

          <div className="py-10">
            <button
              // onClick={() => onSubmit()}
              onClick={() => openGuardarDatos()}
              className="bg-indigo-500 py-2 px-5 rounded-full text-white font-semibold shadow"
              type="button"
            >
              Guardar los datos en la base de datos.
            </button>
          </div>
        </>
      )}
      <ModalGuardarDatos
        closeModalGuardarDatos={closeGuardarDatos}
        guardarDatosModal={guradarDatosModal}
        onSubmit={onSubmit}
      />

      <div className="flex">
        <PDFDownloadLink
          fileName={`PRESUPUESTO ASIGNADO + DIFERENCIAS + ETC, MES ${obtenerMes(
            fechaObtenida
          )}`}
          className="bg-green-500/90 rounded-full py-3 px-6 text-white shadow font-semibold flex gap-2 items-center"
          target="_blank"
          download={false}
          document={
            <TablaDescargarPdf
              datos={egresos}
              presupuestoAsignado={presupuestoAsignado}
              fechaObtenida={fechaObtenida}
              canjes={canjes}
            />
          }
        >
          Descargar e imprimir la estadistica filtrada.
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
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
        </PDFDownloadLink>
      </div>
    </div>
  );
};

const Skeleton = () => {
  return (
    <div>
      <div className="grid grid-cols-4 gap-5">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-xl border border-gray-200 bg-gray-200 p-8"
          >
            <div className="flex gap-4 items-center">
              <div className="rounded-full bg-gray-300 h-12 w-12"></div>
              <div>
                <div className="h-6 bg-gray-300 w-24 mb-2"></div>
                <div className="h-4 bg-gray-300 w-16"></div>
              </div>
            </div>
            <div className="inline-flex gap-2 rounded-xl bg-gray-300 p-2">
              <div className="h-4 bg-gray-300 w-8"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="animate-pulse rounded-xl border border-gray-200 bg-gray-200 p-8 w-[400px] mt-5"></div>

      <div className="animate-pulse rounded-xl border border-gray-200 bg-gray-200 p-8 w-full mt-5 h-full space-y-3">
        {[...Array(11)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-xl border  bg-gray-300 py-8 px-2"
          ></div>
        ))}
      </div>
    </div>
  );
};

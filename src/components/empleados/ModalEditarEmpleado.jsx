import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { editarTipo, obtenerUnicoTipo } from "../../api/fabrica.api";
import { useForm } from "react-hook-form";
import { useEmpleadosContext } from "../../context/EmpleadosProvider";
import {
  actualizarEmpleado,
  obtenerUnicoEmpleado,
} from "../../api/empleados.api";

export const ModalEditarEmpleado = ({
  obtenerId,
  isOpenEdit,
  closeModalEdit,
}) => {
  const { empleados, setEmpleados, fabricas } = useEmpleadosContext();

  //errores
  const [error, setError] = useState(null);

  const [datos, setDatos] = useState([]);

  //formulario state
  const [empleado, setEmpleado] = useState("");
  const [fecha, setFecha] = useState("");
  const [tipo, setTipo] = useState("");
  const [antiguedad, setAntiguedad] = useState(0);
  const [tipo_fabrica, setTipoFabrica] = useState("");
  const [quincena_del_cinco, setQuincenaCinco] = useState(0);
  const [quincena_del_veinte, setQuincenaVeinte] = useState(0);
  const [setTotalAntiguedad] = useState(0);
  const [banco, setBanco] = useState(0);
  const [premio_asistencia, setAsistencia] = useState(0);
  const [premio_produccion, setProduccion] = useState(0);
  const [comida_produccion, setProducci] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [setTotalQuincena] = useState(0);
  const [setTotalQuincenaVeinte] = useState(0);
  const [setTotalFinal] = useState(0);
  const [obs, setObs] = useState("");
  const [otros, setOtros] = useState(0);
  const [obs_20, setObs20] = useState("");
  const [descuento_20, setDescuento20] = useState(0);
  const [rol, setRol] = useState("");
  //   const params = useParams();

  useEffect(() => {
    async function loadData() {
      const res = await obtenerUnicoEmpleado(obtenerId);

      setDatos(res.data);

      const empleadoData = res.data;

      // Convertir la fecha de ISO a "YYYY-MM-DD"
      const fechaISO = new Date(empleadoData.fecha);
      const fechaFormateada = fechaISO.toISOString().split("T")[0];

      // Establecer los valores en los estados
      setEmpleado(empleadoData.empleado || "");
      setFecha(fechaFormateada || "");
      setTipo(empleadoData.tipo || "");
      setAntiguedad(empleadoData.antiguedad || 0);
      setQuincenaCinco(empleadoData.quincena_del_cinco || 0);
      setQuincenaVeinte(empleadoData.quincena_del_veinte || 0);
      setBanco(empleadoData.banco || 0);
      setAsistencia(empleadoData.premio_asistencia || 0);
      setProduccion(empleadoData.premio_produccion || 0);
      setProducci(empleadoData.comida_produccion || 0);
      setDescuento(empleadoData.descuento || 0);
      setTipoFabrica(empleadoData.tipo_fabrica || "");
      setObs(empleadoData.obs || "");
      setObs20(empleadoData.obs_20 || "");
      setOtros(empleadoData.otros || "");
      setDescuento20(empleadoData.descuento_20 || 0);
      setRol(empleadoData.rol || "");
    }

    loadData();
  }, [obtenerId]);

  const total_antiguedad =
    (Number(quincena_del_cinco) + Number(quincena_del_veinte)) *
    (0.01 * Number(antiguedad));

  const total_quincena =
    Number(quincena_del_cinco) +
    Number(banco) +
    Number(premio_asistencia) +
    Number(premio_produccion) +
    Number(total_antiguedad) -
    Number(otros) -
    Number(descuento);

  const total_quincena_veinte =
    Number(quincena_del_veinte) +
    Number(comida_produccion) -
    Number(descuento_20);

  const total_final =
    Number(total_quincena_veinte) + Number(otros) + Number(total_quincena);

  //   const navigate = useNavigate();

  //
  const onSubmit = async (e) => {
    try {
      e.preventDefault();

      const res = await actualizarEmpleado(obtenerId, {
        empleado,
        fecha,
        tipo,
        antiguedad,
        quincena_del_cinco,
        quincena_del_veinte,
        total_antiguedad,
        banco,
        premio_asistencia,
        premio_produccion,
        comida_produccion,
        descuento,
        obs,
        otros,
        total_quincena,
        total_quincena_veinte,
        total_final,
        tipo_fabrica,
        obs_20,
        descuento_20,
        rol,
      });

      const tipoExistenteIndex = empleados.findIndex(
        (tipo) => tipo.id == obtenerId
      );

      setEmpleados((prevTipos) => {
        const newTipos = [...prevTipos];
        const updatedEmpleado = JSON.parse(res.config.data); // Convierte el JSON a objeto

        newTipos[tipoExistenteIndex] = {
          id: obtenerId,
          empleado: updatedEmpleado.empleado,
          fecha: updatedEmpleado.fecha,
          tipo: updatedEmpleado.tipo,
          tipo_fabrica: updatedEmpleado.tipo_fabrica,
          antiguedad: updatedEmpleado.antiguedad,
          quincena_del_cinco: updatedEmpleado.quincena_del_cinco,
          quincena_del_veinte: updatedEmpleado.quincena_del_veinte,
          total_antiguedad: updatedEmpleado.total_antiguedad,
          banco: updatedEmpleado.banco,
          premio_produccion: updatedEmpleado.premio_produccion,
          premio_asistencia: updatedEmpleado.premio_asistencia,
          comida_produccion: updatedEmpleado.comida_produccion,
          descuento: updatedEmpleado.descuento,
          total_quincena: updatedEmpleado.total_quincena,
          total_quincena_veinte: updatedEmpleado.total_quincena_veinte,
          total_final: updatedEmpleado.total_final,
          obs: updatedEmpleado.obs,
          otros: updatedEmpleado.otros,
          descuento_20: updatedEmpleado.descuento_20,
          obs_20: updatedEmpleado.obs_20,
          rol: updatedEmpleado.rol,
        };
        return newTipos;
      });

      toast.success("¡Empleado editado correctamente!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: {
          borderRadius: "10px",
          borderStyle: "1px solid #e5e7eb",
          padding: "10px",
        },
      });

      setError(null);

      setTimeout(() => {
        closeModalEdit();
      }, 500);
    } catch (error) {
      if (error.response.data.message) {
        setError(error.response.data.message);

        // Ocultar el error después de 5 segundos
        setTimeout(() => {
          setError(null);
        }, 4000);
      }
    }
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

          <div className="min-h-screen  text-center">
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
              className="inline-block h-screen max-h-full align-middle"
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
              <div className="inline-block w-full h-full p-6 my-0 px-5 text-left align-middle transition-all transform bg-white shadow-xl rounded-none max-w-full z-[101]">
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
                <div className="text-base text-indigo-500 border-b-[1px] uppercase mb-10 font-semibold">
                  Editar empleado /{" "}
                  <span className="font-bold text-slate-600">
                    {datos.empleado}
                  </span>
                </div>

                <form onSubmit={onSubmit} action="#" className="space-y-6">
                  <div>
                    <p className="font-bold text-slate-700 mx-3">
                      Datos del empleado 🧑‍💼
                    </p>
                  </div>
                  <article className="flex gap-2">
                    <div className="w-full">
                      <label
                        htmlFor="Empleado"
                        className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                      >
                        <input
                          value={empleado}
                          onChange={(e) => setEmpleado(e.target.value)}
                          type="text"
                          id="Empleado"
                          className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3 uppercase font-semibold"
                          placeholder="Empleado"
                        />

                        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                          Escribrir el empleado
                        </span>
                      </label>
                    </div>

                    <div className="w-full">
                      <label
                        htmlFor="Fecha de ingreso"
                        className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                      >
                        <input
                          input
                          value={fecha}
                          onChange={(e) => setFecha(e.target.value)}
                          type="date"
                          id="Fecha de ingreso"
                          className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3 font-semibold"
                          placeholder="Fecha de ingreso"
                        />

                        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                          Fecha de ingreso
                        </span>
                      </label>
                    </div>

                    <div className="w-full h-full">
                      <label
                        htmlFor="tipo"
                        className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                      >
                        <select
                          value={tipo}
                          onChange={(e) => setTipo(e.target.value)}
                          type="text"
                          id="tipo"
                          className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3 uppercase w-full font-semibold"
                          placeholder="tipo"
                        >
                          <option value="">Seleccionar</option>
                          <option value="mensual">Mensual</option>
                          <option value="quincenal">Quincenal</option>
                        </select>

                        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                          Seleccionar el tipo de sueldo
                        </span>
                      </label>
                    </div>

                    <div className="w-full h-full">
                      <label
                        htmlFor="tipo_fabrica"
                        className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                      >
                        <select
                          value={tipo_fabrica}
                          onChange={(e) => setTipoFabrica(e.target.value)}
                          type="text"
                          id="tipo"
                          className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3 uppercase w-full font-semibold"
                        >
                          <option value="">Seleccionar</option>
                          {fabricas.map((f) => (
                            <option value={f.tipo} key={f.id}>
                              {f.tipo}
                            </option>
                          ))}
                        </select>

                        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                          Seleccionar zona o fabrica
                        </span>
                      </label>
                    </div>

                    {(tipo_fabrica === "parque industrial" ||
                      tipo_fabrica === "long") && (
                      <div className="w-full h-full">
                        <label
                          htmlFor="tipo_rol"
                          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                        >
                          <select
                            value={rol}
                            onChange={(e) => setRol(e.target.value)}
                            id="tipo_rol"
                            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3 uppercase w-full font-semibold"
                          >
                            <option value="">Seleccionar el rol</option>
                            <option value="armado">Armado</option>
                            <option value="producción">Producción</option>
                          </select>

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                            Seleccionar rol/sección
                          </span>
                        </label>
                      </div>
                    )}
                  </article>

                  {tipo === "mensual" ? (
                    <>
                      <div>
                        <p className="font-bold text-slate-700 mx-3">
                          Comprobante del mensual 📆
                        </p>
                      </div>
                      <article className="grid grid-cols-4 gap-6">
                        <div className="w-full">
                          <label
                            htmlFor="antiguedad"
                            className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                          >
                            <input
                              value={antiguedad}
                              onChange={(e) => setAntiguedad(e.target.value)}
                              type="text"
                              id="antiguedad"
                              className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3 font-semibold"
                              placeholder="antiguedad"
                            />

                            <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                              Escribrir la antiguedad
                            </span>
                          </label>
                        </div>
                        <div className="w-full">
                          <label
                            htmlFor="quincena_del_cinco"
                            className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                          >
                            <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                              Total del sueldo mensual
                            </span>
                            <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                              <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                                $
                              </span>
                              <input
                                value={quincena_del_cinco}
                                onChange={(e) =>
                                  setQuincenaCinco(e.target.value)
                                }
                                className="outline-none py-0 px-4 text-slate-600 uppercase font-semibold"
                                type="text"
                                id="quincena_del_cinco"
                              />

                              <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                                ARS
                              </span>
                            </div>
                          </label>
                        </div>
                        <div className="w-full">
                          <label
                            htmlFor="total_antiguedad"
                            className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                          >
                            <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                              Total Antiguedad
                            </span>
                            <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                              <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                                $
                              </span>
                              <input
                                value={total_antiguedad}
                                onChange={(e) =>
                                  setTotalAntiguedad(e.target.value)
                                }
                                className="outline-none py-0 px-4 text-slate-600font-semibold"
                                type="text"
                                id="total_antiguedad"
                              />

                              <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                                ARS
                              </span>
                            </div>
                          </label>
                        </div>
                        <div className="w-full">
                          <label
                            htmlFor="banco"
                            className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                          >
                            <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                              Otros / etc
                            </span>
                            <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                              <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                                $
                              </span>
                              <input
                                value={banco}
                                onChange={(e) => setBanco(e.target.value)}
                                className="outline-none py-0 px-4 text-slate-600 font-semibold"
                                type="text"
                                id="banco"
                              />

                              <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                                ARS
                              </span>
                            </div>
                          </label>
                        </div>
                        {tipo_fabrica === "gerencia" ? (
                          <div className="w-full">
                            <label
                              htmlFor=""
                              className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                            >
                              <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                                Premio Produccion
                              </span>
                              <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                                <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                                  $
                                </span>
                                <input
                                  value={premio_produccion}
                                  onChange={(e) =>
                                    setProduccion(e.target.value)
                                  }
                                  className="outline-none py-0 px-4 text-slate-600 font-semibold"
                                  type="text"
                                  id=""
                                />

                                <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                                  ARS
                                </span>
                              </div>
                            </label>
                          </div>
                        ) : (
                          ""
                        )}

                        <div className="w-full">
                          <label
                            htmlFor=""
                            className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                          >
                            <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                              Premio Asistencia
                            </span>
                            <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                              <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                                $
                              </span>
                              <input
                                value={premio_asistencia}
                                onChange={(e) => setAsistencia(e.target.value)}
                                className="outline-none py-0 px-4 text-slate-600 font-semibold"
                                type="text"
                                id=""
                              />

                              <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                                ARS
                              </span>
                            </div>
                          </label>
                        </div>

                        <div className="w-full">
                          <label
                            htmlFor=""
                            className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                          >
                            <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                              Comida Producción
                            </span>
                            <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                              <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                                $
                              </span>
                              <input
                                value={comida_produccion}
                                onChange={(e) => setProducci(e.target.value)}
                                className="outline-none py-0 px-4 text-slate-600 font-semibold"
                                type="text"
                                id=""
                              />

                              <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                                ARS
                              </span>
                            </div>
                          </label>
                        </div>

                        <label
                          htmlFor=""
                          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                        >
                          <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                            Banco
                          </span>
                          <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                            <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                              $
                            </span>
                            <input
                              value={otros}
                              onChange={(e) => setOtros(e.target.value)}
                              className="outline-none py-0 px-4 text-slate-600 font-semibold"
                              type="text"
                              id=""
                            />

                            <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                              ARS
                            </span>
                          </div>
                        </label>
                        <label
                          htmlFor=""
                          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                        >
                          <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                            Descuentos
                          </span>
                          <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                            <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                              $
                            </span>
                            <input
                              value={descuento}
                              onChange={(e) => setDescuento(e.target.value)}
                              className="outline-none py-0 px-4 text-slate-600 font-semibold"
                              type="text"
                              id=""
                            />

                            <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                              ARS
                            </span>
                          </div>
                        </label>
                      </article>
                      <div className="grid grid-cols-3">
                        <div className="flex flex-col gap-2 font-semibold text-gray-700 text-sm">
                          <label htmlFor="observacion">
                            Observación del empleado por faltas/descuentos
                          </label>

                          <textarea
                            value={obs}
                            onChange={(e) => setObs(e.target.value)}
                            className="h-24 resize-none relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 w-full px-5 py-5 text-slate-700 uppercase focus:outline-indigo-500"
                            placeholder="Observacion por faltas o descuentos"
                            rows="8"
                            id="observacion"
                          />
                        </div>
                      </div>

                      <div>
                        <p className="font-bold text-slate-700 mx-3">
                          Total finales sueldo
                        </p>
                      </div>

                      <div className="grid-cols-3 grid gap-6">
                        <label
                          htmlFor=""
                          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
                        >
                          <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs font-bold">
                            Total sueldo con descuento banco a pagar
                          </span>
                          <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                            <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                              $
                            </span>
                            <input
                              value={total_quincena}
                              onChange={(e) => setTotalQuincena(e.target.value)}
                              className="outline-none py-0 px-4 text-slate-600 font-extrabold"
                              type="text"
                              id=""
                            />

                            <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                              ARS
                            </span>
                          </div>
                        </label>
                        <label
                          htmlFor=""
                          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-bold"
                        >
                          <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                            Total Final del sueldo
                          </span>
                          <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                            <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                              $
                            </span>
                            <input
                              value={total_final}
                              onChange={(e) => setTotalFinal(e.target.value)}
                              className="outline-none py-0 px-4 text-slate-600 font-extrabold"
                              type="text"
                              id=""
                            />

                            <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                              ARS
                            </span>
                          </div>
                        </label>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="font-bold text-slate-700 mx-3">
                          Comprobante del 5 📆
                        </p>
                      </div>

                      <article className="grid grid-cols-4 gap-6">
                        <div className="w-full">
                          <label
                            htmlFor="antiguedad"
                            className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                          >
                            <input
                              value={antiguedad}
                              onChange={(e) => setAntiguedad(e.target.value)}
                              type="text"
                              id="antiguedad"
                              className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3 font-semibold"
                              placeholder="antiguedad"
                            />

                            <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                              Escribrir la antiguedad
                            </span>
                          </label>
                        </div>
                        <div className="w-full">
                          <label
                            htmlFor="quincena_del_cinco"
                            className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                          >
                            <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                              Total quincena del 5
                            </span>
                            <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                              <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                                $
                              </span>
                              <input
                                value={quincena_del_cinco}
                                onChange={(e) =>
                                  setQuincenaCinco(e.target.value)
                                }
                                className="outline-none py-0 px-4 text-slate-600 font-semibold"
                                type="text"
                                id="quincena_del_cinco"
                              />

                              <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                                ARS
                              </span>
                            </div>
                          </label>
                        </div>
                        <div className="w-full">
                          <label
                            htmlFor="total_antiguedad"
                            className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                          >
                            <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                              Total Antiguedad
                            </span>
                            <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                              <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                                $
                              </span>
                              <input
                                value={total_antiguedad}
                                onChange={(e) =>
                                  setTotalAntiguedad(e.target.value)
                                }
                                className="outline-none py-0 px-4 text-slate-600 font-semibold"
                                type="text"
                                id="total_antiguedad"
                              />

                              <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                                ARS
                              </span>
                            </div>
                          </label>
                        </div>
                        <div className="w-full">
                          <label
                            htmlFor="banco"
                            className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                          >
                            <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                              Otros / etc
                            </span>
                            <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                              <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                                $
                              </span>
                              <input
                                value={banco}
                                onChange={(e) => setBanco(e.target.value)}
                                className="outline-none py-0 px-4 text-slate-600 font-semibold"
                                type="text"
                                id="banco"
                              />

                              <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                                ARS
                              </span>
                            </div>
                          </label>
                        </div>
                        {rol === "armado" ? (
                          ""
                        ) : (
                          <div className="w-full">
                            <label
                              htmlFor=""
                              className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                            >
                              <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                                Premio Produccion
                              </span>
                              <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                                <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                                  $
                                </span>
                                <input
                                  value={premio_produccion}
                                  onChange={(e) =>
                                    setProduccion(e.target.value)
                                  }
                                  className="outline-none py-0 px-4 text-slate-600 font-semibold"
                                  type="text"
                                  id=""
                                />

                                <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                                  ARS
                                </span>
                              </div>
                            </label>
                          </div>
                        )}

                        <div className="w-full">
                          <label
                            htmlFor=""
                            className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                          >
                            <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                              Premio Asistencia
                            </span>
                            <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                              <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                                $
                              </span>
                              <input
                                value={premio_asistencia}
                                onChange={(e) => setAsistencia(e.target.value)}
                                className="outline-none py-0 px-4 text-slate-600 font-semibold"
                                type="text"
                                id=""
                              />

                              <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                                ARS
                              </span>
                            </div>
                          </label>
                        </div>

                        <label
                          htmlFor=""
                          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                        >
                          <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                            Banco
                          </span>
                          <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                            <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                              $
                            </span>
                            <input
                              value={otros}
                              onChange={(e) => setOtros(e.target.value)}
                              className="outline-none py-0 px-4 text-slate-600 font-semibold"
                              type="text"
                              id=""
                            />

                            <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                              ARS
                            </span>
                          </div>
                        </label>
                        <label
                          htmlFor=""
                          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                        >
                          <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                            Descuentos
                          </span>
                          <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                            <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                              $
                            </span>
                            <input
                              value={descuento}
                              onChange={(e) => setDescuento(e.target.value)}
                              className="outline-none py-0 px-4 text-slate-600 font-semibold"
                              type="text"
                              id=""
                            />

                            <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                              ARS
                            </span>
                          </div>
                        </label>
                      </article>
                      <div className="flex flex-col gap-2 font-semibold text-gray-700 text-sm w-1/4">
                        <label htmlFor="observacion">
                          Observación del empleado quincena del 5
                        </label>

                        <textarea
                          value={obs}
                          onChange={(e) => setObs(e.target.value)}
                          className="h-24 resize-none relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 w-full px-5 py-5 text-slate-700 uppercase focus:outline-indigo-500"
                          placeholder="Observacion por faltas o descuentos quincena del 5"
                          rows="8"
                          id="observacion"
                        />
                      </div>

                      <div>
                        <p className="font-bold text-slate-700 mx-3">
                          Comprobante del 20 📆
                        </p>
                      </div>
                      <article className="grid grid-cols-3 gap-4">
                        <div className="w-full">
                          <label
                            htmlFor="quincena_del_veinte"
                            className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                          >
                            <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                              Total quincena del 20
                            </span>
                            <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                              <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                                $
                              </span>
                              <input
                                value={quincena_del_veinte}
                                onChange={(e) =>
                                  setQuincenaVeinte(e.target.value)
                                }
                                className="outline-none py-0 px-4 text-slate-600 font-semibold"
                                type="text"
                                id="quincena_del_veinte"
                              />

                              <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                                ARS
                              </span>
                            </div>
                          </label>
                        </div>
                        <label
                          htmlFor=""
                          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                        >
                          <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                            Descuentos
                          </span>
                          <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                            <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                              $
                            </span>
                            <input
                              value={descuento_20}
                              onChange={(e) => setDescuento20(e.target.value)}
                              className="outline-none py-0 px-4 text-slate-600 font-semibold"
                              type="text"
                              id=""
                            />

                            <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                              ARS
                            </span>
                          </div>
                        </label>
                        <div className="w-full">
                          <label
                            htmlFor=""
                            className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-semibold"
                          >
                            <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                              Comida Producción
                            </span>
                            <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                              <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                                $
                              </span>
                              <input
                                value={comida_produccion}
                                onChange={(e) => setProducci(e.target.value)}
                                className="outline-none py-0 px-4 text-slate-600 font-semibold"
                                type="text"
                                id=""
                              />

                              <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                                ARS
                              </span>
                            </div>
                          </label>
                        </div>

                        <div className="flex flex-col gap-2 font-semibold text-gray-700 text-sm">
                          <label htmlFor="observacion">
                            Observación del empleado quincena del 20
                          </label>

                          <textarea
                            value={obs_20}
                            onChange={(e) => setObs20(e.target.value)}
                            className="h-24 resize-none relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 w-full px-5 py-5 text-slate-700 uppercase focus:outline-indigo-500"
                            placeholder="Observacion por faltas o descuentos quincena del 20"
                            rows="8"
                            id="observacion"
                          />
                        </div>
                      </article>

                      <div>
                        <p className="font-bold text-slate-700 mx-3">
                          Totales finales del sueldo
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <label
                          htmlFor=""
                          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-bold"
                        >
                          <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                            Total Quincena del 5
                          </span>
                          <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                            <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                              $
                            </span>
                            <input
                              value={total_quincena}
                              onChange={(e) => setTotalQuincena(e.target.value)}
                              className="outline-none py-0 px-4 text-slate-600 font-extrabold"
                              type="text"
                              id=""
                            />

                            <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                              ARS
                            </span>
                          </div>
                        </label>
                        <label
                          htmlFor=""
                          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-bold"
                        >
                          <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                            Total Quincena del 20
                          </span>
                          <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                            <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                              $
                            </span>
                            <input
                              value={total_quincena_veinte}
                              onChange={(e) =>
                                setTotalQuincenaVeinte(e.target.value)
                              }
                              className="outline-none py-0 px-4 text-slate-600 font-extrabold"
                              type="text"
                              id=""
                            />

                            <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                              ARS
                            </span>
                          </div>
                        </label>

                        <label
                          htmlFor=""
                          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 font-bold"
                        >
                          <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                            Total Final
                          </span>
                          <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                            <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                              $
                            </span>
                            <input
                              value={total_final}
                              onChange={(e) => setTotalFinal(e.target.value)}
                              className="outline-none py-0 px-4 text-slate-600 font-extrabold"
                              type="text"
                              id=""
                            />

                            <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                              ARS
                            </span>
                          </div>
                        </label>
                      </div>
                    </>
                  )}

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-block w-full rounded-full text-sm font-bold bg-indigo-500 px-5 py-3 text-white sm:w-auto"
                    >
                      Editar el empleado
                    </button>
                  </div>
                </form>

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
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};

// import { useForm } from "react-hook-form";
import { useEmpleadosContext } from "../../../context/EmpleadosProvider";
import { crearNuevoEmpleado } from "../../../api/empleados.api";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";

export const CrearNuevoEmpleado = () => {
  const { empleados, setEmpleados, fabricas } = useEmpleadosContext();

  //errores
  const [error, setError] = useState(null);

  //formulario state
  const [empleado, setEmpleado] = useState("");
  const [fecha, setFecha] = useState("");
  const [tipo, setTipo] = useState("");
  const [antiguedad, setAntiguedad] = useState(0);
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
  const [tipo_fabrica, setTipoFabrica] = useState("");
  const [obs, setObs] = useState("");
  const [otros, setOtros] = useState(0);
  const [descuento_20, setDescuento20] = useState(0);
  const [obs_20, setObs20] = useState("");
  const [rol, setRol] = useState("");

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

  const navigate = useNavigate();

  //
  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await crearNuevoEmpleado({
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
        otros,
        total_quincena,
        total_quincena_veinte,
        total_final,
        obs,
        tipo_fabrica,
        obs_20,
        descuento_20,
        rol,
      });

      // const tipoExistente = empleados.find((tipo) => tipo.id === res.data.id);

      // if (!tipoExistente) {
      // Actualizar el estado de tipos agregando el nuevo tipo al final
      setEmpleados((prevTipos) => [...prevTipos, res.data]);
      // }

      toast.success("¡Empleado creado correctamente!", {
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
        navigate("/empleados");
      }, 1000);
    } catch (error) {
      //   if (error.response.data.message) {
      //     toast.error(`Error: ${error.response.data.message}`, {});
      //   }

      if (error.response.data.message) {
        setError(error.response.data.message);

        // Ocultar el error después de 5 segundos
        setTimeout(() => {
          setError(null);
        }, 4000);
      }
    }
  };

  const totalFinalSum = empleados?.reduce((acumulador, empleado) => {
    return acumulador + parseFloat(empleado?.total_final);
  }, 0);

  return (
    <section className="px-10 py-16 w-full h-full flex flex-col gap-5">
      <ToastContainer />

      <div className="mb-2 flex flex-col">
        <p className="text-slate-700 text-xl font-semibold">
          Crear nuevo empleado
        </p>
        <p>
          Registra nuevo empleado rellena los siguientes campos para crear un
          nuevo empleado.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-2xl shadow-gray-400/70">
        {error && (
          <div className="flex justify-center mb-6">
            <p className="text-red-400 text-center py-3 text-sm rounded-lg px-6 border-red-100 border-[1px] bg-red-500/10">
              {error}
            </p>
          </div>
        )}
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
                        onChange={(e) => setQuincenaCinco(e.target.value)}
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
                        onChange={(e) => setTotalAntiguedad(e.target.value)}
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
                          onChange={(e) => setProduccion(e.target.value)}
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
                        onChange={(e) => setQuincenaCinco(e.target.value)}
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
                        onChange={(e) => setTotalAntiguedad(e.target.value)}
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
                          onChange={(e) => setProduccion(e.target.value)}
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
                        onChange={(e) => setQuincenaVeinte(e.target.value)}
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
                      onChange={(e) => setTotalQuincenaVeinte(e.target.value)}
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
              Crear el empleado
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

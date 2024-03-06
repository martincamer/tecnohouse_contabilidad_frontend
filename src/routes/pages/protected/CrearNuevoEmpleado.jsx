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

  const total_antiguedad =
    (Number(quincena_del_cinco) + Number(quincena_del_veinte)) *
    (0.01 * Number(antiguedad));

  const total_quincena =
    Number(quincena_del_cinco) +
    Number(banco) +
    Number(premio_asistencia) +
    Number(premio_produccion) +
    Number(total_antiguedad) -
    Number(descuento);

  const total_quincena_veinte =
    Number(quincena_del_veinte) + Number(banco) + Number(comida_produccion);

  const total_final = Number(total_quincena_veinte) + Number(total_quincena);

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
        total_quincena,
        total_quincena_veinte,
        total_final,
        obs,
        tipo_fabrica,
      });

      // Verificar si el tipo ya existe antes de agregarlo al estado
      const tipoExistente = empleados.find((tipo) => tipo.id === res.data.id);

      if (!tipoExistente) {
        // Actualizar el estado de tipos agregando el nuevo tipo al final
        setEmpleados((prevTipos) => [...prevTipos, res.data]);
      }

      toast.success("¡Empleado creado correctamente!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
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
    // Convertir el valor de total_final a número y sumarlo al acumulador
    return acumulador + parseFloat(empleado?.total_final);
  }, 0);

  return (
    <section className="px-10 py-16 w-full h-full flex flex-col gap-5">
      <ToastContainer />
      <Link
        to={"/empleados"}
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

      <div className="bg-white w-full border-[1px] border-slate-300 shadow-sm shadow-slate-400 rounded-lg flex gap-4 items-center justify-center">
        <div className="py-5 px-6 flex flex-col justify-center items-center gap-1 w-full h-full border-r-[1px] border-slate-300">
          <p className="text-indigo-500 text-sm">Total empleados creados</p>
          <p className="text-slate-700 text-sm font-semibold">
            {empleados.length}
          </p>
        </div>

        <div className="py-5 px-6 flex flex-col justify-center items-center gap-1 w-full h-full border-r-[1px] border-slate-300">
          <p className="text-indigo-500 text-sm">Total a pagar en empleados</p>
          <p className="text-slate-700 text-sm font-semibold">
            {Number(totalFinalSum).toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </p>
        </div>

        <div className="py-5 px-6 flex flex-col justify-center items-center gap-1 w-full h-full border-r-[1px] border-slate-300">
          <p className="text-indigo-500 text-sm">Total fabricas cargadas</p>
          <p className="text-slate-700 text-sm font-semibold">
            {fabricas.length}
          </p>
        </div>
      </div>

      {/* formulario  */}

      <div className="mt-5 ml-5  flex">
        <p className="text-slate-600 border-b-indigo-600 border-b-[3px]">
          Crear nuevo empleado
        </p>
      </div>

      <div className="rounded-lg bg-white p-8 shadow lg:col-span-3 lg:p-12 border-slate-300 border-[1px]">
        {error && (
          <div className="flex justify-center mb-6">
            <p className="text-red-400 text-center py-3 text-sm rounded-lg px-6 border-red-100 border-[1px] bg-red-500/10">
              {error}
            </p>
          </div>
        )}
        <form onSubmit={onSubmit} action="#" className="space-y-6">
          <article className="flex gap-2">
            <div className="w-full">
              <label
                htmlFor="Empleado"
                className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
              >
                <input
                  //   {...register("empleado", { required: true })}
                  value={empleado}
                  onChange={(e) => setEmpleado(e.target.value)}
                  type="text"
                  id="Empleado"
                  className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3"
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
                className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
              >
                <input
                  input
                  //   {...register("fecha", { required: true })}
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  type="date"
                  id="Fecha de ingreso"
                  className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3"
                  placeholder="Fecha de ingreso"
                />

                <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                  Fecha de ingreso
                </span>
              </label>
            </div>
          </article>

          <article className="flex gap-2">
            <div className="w-full h-full">
              <label
                htmlFor="tipo"
                className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
              >
                <select
                  //   {...register("tipo", { required: true })}
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  type="text"
                  id="tipo"
                  className="peer border-none focus:border-transparent focus:outline-none focus:ring-0 py-3.5 text-slate-700 px-3 bg-white"
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
                className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
              >
                <select
                  //   {...register("tipo", { required: true })}
                  value={tipo_fabrica}
                  onChange={(e) => setTipoFabrica(e.target.value)}
                  type="text"
                  id="tipo"
                  className="peer border-none focus:border-transparent focus:outline-none focus:ring-0 py-3.5 text-slate-700 px-3 bg-white"
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
            <div className="w-full">
              <label
                htmlFor="antiguedad"
                className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
              >
                <input
                  //   {...register("antiguedad", { required: true })}
                  value={antiguedad}
                  onChange={(e) => setAntiguedad(e.target.value)}
                  type="text"
                  id="antiguedad"
                  className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3"
                  placeholder="antiguedad"
                  //   onBlur={() => calcularTotalAntiguedad()}
                />

                <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                  Escribrir la antiguedad
                </span>
              </label>
            </div>
          </article>

          <article className="flex gap-2">
            <div className="w-full">
              <label
                htmlFor="quincena_del_cinco"
                className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
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
                    // {...register("quincena_del_cinco", { required: true })}
                    className="outline-none py-0 px-4 text-slate-600"
                    type="text"
                    id="quincena_del_cinco"
                    // onBlur={() => calcularTotalAntiguedad()}
                  />

                  <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                    ARS
                  </span>
                </div>
              </label>
            </div>

            <div className="w-full">
              <label
                htmlFor="quincena_del_cinco"
                className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
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
                    // {...register("quincena_del_veinte", { required: true })}
                    className="outline-none py-0 px-4 text-slate-600"
                    type="text"
                    id="quincena_del_veinte"
                    // onBlur={() => calcularTotalAntiguedad()}
                  />

                  <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                    ARS
                  </span>
                </div>
              </label>
            </div>
          </article>

          <article className="flex gap-2">
            <div className="w-full">
              <label
                htmlFor="total_antiguedad"
                className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
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
                    // onBlur={() => calcularTotalAntiguedad()}
                    // {...register("total_antiguedad", { required: true })}
                    className="outline-none py-0 px-4 text-slate-600"
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
                className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
              >
                <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                  Total Banco
                </span>
                <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                  <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                    $
                  </span>
                  <input
                    value={banco}
                    onChange={(e) => setBanco(e.target.value)}
                    // onBlur={() => calcularTotalQuincenaDelCinco()}
                    // {...register("banco", { required: true })}
                    className="outline-none py-0 px-4 text-slate-600"
                    type="text"
                    id="banco"
                  />

                  <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                    ARS
                  </span>
                </div>
              </label>
            </div>
          </article>

          <article className="flex gap-2">
            <div className="w-full">
              <label
                htmlFor=""
                className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
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
                    // onBlur={() => calcularTotalAntiguedad()}
                    // {...register("premio_produccion", { required: true })}
                    className="outline-none py-0 px-4 text-slate-600"
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
                className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
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
                    // onBlur={() => calcularTotalAntiguedad()}
                    // {...register("premio_asistencia", { required: true })}
                    className="outline-none py-0 px-4 text-slate-600"
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
                className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
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
                    // onBlur={() => calcularTotalAntiguedad()}
                    // {...register("comida_produccion", { required: true })}
                    className="outline-none py-0 px-4 text-slate-600"
                    type="text"
                    id=""
                  />

                  <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                    ARS
                  </span>
                </div>
              </label>
            </div>
          </article>

          <div className="w-1/3">
            <label
              htmlFor=""
              className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
            >
              <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                Descuentos
              </span>
              <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                  $
                </span>
                <input
                  //   onBlur={() => calcularTotalAntiguedad()}
                  //   {...register("descuento", { required: true })}
                  value={descuento}
                  onChange={(e) => setDescuento(e.target.value)}
                  className="outline-none py-0 px-4 text-slate-600"
                  type="text"
                  id=""
                />

                <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                  ARS
                </span>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <label
              htmlFor=""
              className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
            >
              <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                Total Quincena del 5
              </span>
              <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                  $
                </span>
                <input
                  //   onBlur={() => calcularTotalQuincenaDelCinco()}
                  //   {...register("nuevo_total", { required: true })}
                  value={total_quincena}
                  onChange={(e) => setTotalQuincena(e.target.value)}
                  className="outline-none py-0 px-4 text-slate-600"
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
              className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
            >
              <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                Total Quincena del 20
              </span>
              <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                  $
                </span>
                <input
                  //   onBlur={() => calcularTotalQuincenaDelCinco()}
                  //   {...register("nuevo_total", { required: true })}
                  value={total_quincena_veinte}
                  onChange={(e) => setTotalQuincenaVeinte(e.target.value)}
                  className="outline-none py-0 px-4 text-slate-600"
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
              className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
            >
              <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                Total Final
              </span>
              <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                  $
                </span>
                <input
                  //   onBlur={() => calcularTotalQuincenaDelCinco()}
                  //   {...register("nuevo_total", { required: true })}
                  value={total_final}
                  onChange={(e) => setTotalFinal(e.target.value)}
                  className="outline-none py-0 px-4 text-slate-600"
                  type="text"
                  id=""
                />

                <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                  ARS
                </span>
              </div>
            </label>
          </div>

          <div>
            <label className="sr-only" htmlFor="observacion">
              Observación del empleado
            </label>

            <textarea
              //   {...register("obs", { required: true })}
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              className="h-24 resize-none relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 w-full py-10 px-10 text-slate-700"
              placeholder="Observacion por faltas o descuentos"
              rows="8"
              id="observacion"
            ></textarea>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
            >
              Crear Nuevo Empleado
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

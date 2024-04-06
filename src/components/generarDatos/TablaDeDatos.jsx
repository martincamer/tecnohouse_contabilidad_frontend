import { useEffect, useState } from "react";
import { useIngresosContext } from "../../context/IngresosProvider";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

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

  return (
    <div className="h-screen">
      {/* <div>
        <div></div>
        <button
          onClick={downloadDataAsExcel}
          type="button"
          className="bg-green-500 text-white py-2 px-4 mt-4 rounded-xl shadow uppercase text-sm"
        >
          Descargar archivo en formato excel
        </button>
      </div> */}
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
      <div className="overflow-x-auto rounded-lg border border-gray-200 mt-5">
        <table className="min-w-full divide-y-1 divide-gray-200 bg-white text-sm">
          <thead>
            <tr className="border-b-[1px]">
              <th className="py-4 px-2 uppercase text-sm text-slate-800 font-bold text-left">
                Numero
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
                className="hover:bg-slate-100 transition-all ease-in-out duration-200 cursor-pointer"
              >
                <td className="py-6 px-3 text-sm text-left text-slate-700 uppercase">
                  {editandoIndice === index ? (
                    <input
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
                    <input
                      type="text"
                      value={nuevoPresupuesto}
                      onChange={(e) => setNuevoPresupuesto(e.target.value)}
                    />
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
                <td className="py-6 px-3 text-sm text-left text-slate-700">
                  {editandoIndice === index ? (
                    <input
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
                    <input
                      type="text"
                      value={nuevaDiferencia}
                      onChange={(e) => setNuevaDiferencia(e.target.value)}
                    />
                  ) : (
                    // Number(egreso.diferencia).toLocaleString("es-AR", {
                    //   style: "currency",
                    //   currency: "ARS",
                    // })
                    `${Number(
                      Number((egreso.porcentaje * presupuestoAsignado) / 100) -
                        egreso.utilizado
                    ).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}`
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
    </div>
  );
};

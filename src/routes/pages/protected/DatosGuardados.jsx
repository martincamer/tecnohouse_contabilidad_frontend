import { useEffect, useState } from "react";
import client from "../../../api/axios";
import { SyncLoader } from "react-spinners";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

export const DatosGuardados = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [datosOriginales, setDatosOriginales] = useState([]); // Guarda los datos originales
  const [datos, setDatos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const obtenerIngresoRangoFechas = async (fechaInicio, fechaFin) => {
    try {
      setLoading(true);

      if (!fechaInicio || !fechaFin) {
        console.error("Fechas no proporcionadas");
        return;
      }

      fechaInicio = new Date(fechaInicio).toISOString().split("T")[0];
      fechaFin = new Date(fechaFin).toISOString().split("T")[0];

      const response = await client.post("/empleados-datos/rango-fechas", {
        fechaInicio,
        fechaFin,
      });

      // Guarda los datos originales al obtener la respuesta
      setDatosOriginales(response.data);
      setDatos(response.data);
    } catch (error) {
      console.error("Error al obtener ingresos:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  const buscarIngresosPorFecha = () => {
    obtenerIngresoRangoFechas(fechaInicio, fechaFin);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    // Filtra los datos según el término de búsqueda
    const filteredDatos = datosOriginales.map((i) => ({
      ...i,
      datos: {
        datos: i.datos?.datos.filter((dato) =>
          dato.empleado.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      },
    }));

    setDatos(filteredDatos);
  }, [searchTerm, datosOriginales]);

  // Restablecer los resultados originales cuando el término de búsqueda se borra
  useEffect(() => {
    if (searchTerm === "") {
      setDatos(datosOriginales);
    }
  }, [searchTerm, datosOriginales]);

  const downloadDataAsExcel = (id) => {
    // Filter the data based on the provided id
    const selectedData = datos
      .map((i) => i.datos?.datos)
      .flat()
      .find((data) => data.id === id);

    if (selectedData) {
      // Create a worksheet with the selected data
      const ws = XLSX.utils.json_to_sheet([selectedData]);

      // Create a workbook and add the worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Datos");

      // Save the file
      XLSX.writeFile(wb, `datos_${id}.xlsx`);
    }
  };

  return (
    <section className="w-full py-20 px-20  h-full">
      <div className="border-[1px] border-slate-300 py-10 px-10 rounded-xl shadow h-screen">
        <div className="text-base font-semibold border- text-indigo-500 uppercase">
          <p>Datos guardados empleados</p>
        </div>

        <div className="mt-5">
          <div className="mt-10">
            <div className="flex gap-6 items-center">
              <div className="flex gap-2 items-center">
                <label className="text-sm text-indigo-500">
                  Fecha de inicio
                </label>
                <input
                  className="text-sm bg-slate-100 py-1 px-2 rounded-lg shadow border-slate-300 border-[1px] cursor-pointer text-slate-700 outline-none"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
              <div className="flex gap-2 items-center">
                <label className="text-sm text-indigo-500">Fecha de fin</label>
                <input
                  className="text-sm bg-slate-100 py-1 px-2 rounded-lg shadow border-slate-300 border-[1px] cursor-pointer text-slate-700 outline-none"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>

              <button
                onClick={buscarIngresosPorFecha}
                className="bg-indigo-500/10 text-sm border-[1px] border-indigo-500 text-indigo-700 px-2 py-1 rounded-md shadow"
              >
                Buscar datos empleados
              </button>
            </div>

            <input
              type="text"
              placeholder="Buscar empleado..."
              className="text-sm bg-white py-2 px-3 rounded-xl shadow border-slate-300 border-[1px] cursor-pointer text-slate-700 outline-none w-1/4 mt-5"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 mt-12 h-[50vh] overflow-y-scroll">
            {loading ? (
              // Muestra el spinner mientras se cargan los datos
              <div className="flex justify-center items-center h-40">
                <SyncLoader color="#4A90E2" size={6} margin={6} />
                <p className="animate-blink text-slate-700 text-sm">
                  Buscando los datos...
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                <thead>
                  <tr className="border-b-[1px]">
                    {/* <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                      Numero
                    </th> */}
                    <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                      Empleado
                    </th>
                    <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                      Tipo de sueldo
                    </th>
                    <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                      Fab o Suc.
                    </th>
                    <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                      Mes numero 5
                    </th>
                    <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                      Mes numero 20
                    </th>
                    <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                      Banco
                    </th>
                    <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                      Otros
                    </th>
                    <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                      Sueldo neto
                    </th>
                    <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                      Ver Resumenes
                    </th>{" "}
                    {/* <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                      Ver datos
                    </th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-left">
                  {datos.map((i) =>
                    i.datos?.datos.map((datos) => (
                      <tr
                        key={datos.id}
                        className="hover:bg-slate-100 transition-all ease-in-out duration-200 cursor-pointer"
                      >
                        {/* <td className="py-3 px-3 text-sm text-left text-slate-700 capitalize">
                          {datos.id}
                        </td> */}
                        <td className="py-3 px-3 text-sm text-left text-slate-700 capitalize">
                          {datos.empleado}
                        </td>
                        <td className="py-3 px-3 text-sm text-left text-slate-700 capitalize">
                          {datos.tipo}
                        </td>
                        <td className="py-3 px-3 text-sm text-left text-slate-700 capitalize">
                          {datos.tipo_fabrica}
                        </td>
                        <td className="py-3 px-3 text-sm text-left text-slate-700 capitalize">
                          {Number(datos.total_quincena).toLocaleString(
                            "es-AR",
                            {
                              style: "currency",
                              currency: "ARS",
                            }
                          )}
                        </td>
                        <td className="py-3 px-3 text-sm text-left text-slate-700 capitalize">
                          {Number(datos.total_quincena_veinte).toLocaleString(
                            "es-AR",
                            {
                              style: "currency",
                              currency: "ARS",
                            }
                          )}
                        </td>
                        <td className="py-3 px-3 text-sm text-left text-slate-700 capitalize">
                          {Number(datos.otros).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          })}
                        </td>
                        <td className="py-3 px-3 text-sm text-left text-slate-700 capitalize">
                          {Number(datos.banco).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          })}
                        </td>

                        <td className="py-3 px-3 text-sm text-left text-slate-700 capitalize">
                          {Number(datos.total_final).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          })}
                        </td>
                        <td className="py-3 px-3 flex text-sm text-left text-slate-700 space-x-2">
                          {datos.tipo === "quincenal" ? (
                            <>
                              <Link
                                to={`/view-pdf-5-datos/${datos.id}`}
                                target="_blank" // Esto abre el enlace en una nueva pestaña
                                rel="noopener noreferrer" // Se recomienda para seguridad y prevención de ataques
                                className={`bg-green-500/10 border-[1px] border-green-500 py-1 px-3 text-green-600 rounded-lg text-left flex gap-2 items-center text-xs font-semibold`}
                              >
                                Imprimir 5
                              </Link>
                              <Link
                                to={`/view-pdf-20-datos/${datos.id}`}
                                target="_blank" // Esto abre el enlace en una nueva pestaña
                                rel="noopener noreferrer" // Se recomienda para seguridad y prevención de ataques
                                className={`bg-green-500/10 border-[1px] border-green-500 py-1 px-3 text-green-600 rounded-lg text-left flex gap-2 items-center text-xs font-semibold`}
                              >
                                Imprimir 20
                              </Link>
                            </>
                          ) : (
                            <Link
                              to={`/view-pdf-mensual-datos/${datos.id}`}
                              target="_blank" // Esto abre el enlace en una nueva pestaña
                              rel="noopener noreferrer" // Se recomienda para seguridad y prevención de ataques
                              className={`bg-green-500/10 border-[1px] border-green-500 py-1 px-3 text-green-600 rounded-lg text-left flex gap-2 items-center text-xs font-semibold`}
                            >
                              Imprimir Mensual
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

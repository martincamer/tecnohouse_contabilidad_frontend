import { useState } from "react";
import { useIngresosContext } from "../../context/IngresosProvider";
import { Link } from "react-router-dom";

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

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 mt-5">
      <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
        <thead>
          <tr className="border-b-[1px]">
            <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
              Numero
            </th>
            <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
              Tipo
            </th>
            <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
              Detalle
            </th>
            <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
              Creador
            </th>
            <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
              Ingreso
            </th>
            <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
              Total
            </th>
            <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
              Editar
            </th>
            <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
              Ver
            </th>
            <th className="py-2 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
              Eliminar
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-left">
          {currentResults.map((i) => (
            <tr
              key={i.id}
              className=" hover:bg-slate-100 transition-all ease-in-out duration-200 cursor-pointer"
            >
              <td className="py-3 px-3 text-sm text-left text-slate-700">
                {i.id}
              </td>
              <td className="py-3 px-3 text-sm text-left text-slate-700 capitalize">
                {i.tipo}
              </td>
              <td className="py-3 px-3 text-sm text-left text-slate-700 capitalize">
                {i.detalle}
              </td>
              <td className="py-3 px-3 text-sm text-left text-slate-700 capitalize">
                {i.usuario}
              </td>
              <td className="py-3 px-3 text-sm text-left text-slate-700">
                {Number(i?.total).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </td>
              <td className="py-3 px-3 text-sm text-left text-slate-700 font-bold">
                {Number(i?.total).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </td>
              <td className="py-3 px-3 text-sm text-left text-slate-700">
                <button
                  onClick={() => {
                    handleIdTwo(i?.id), openModalEditar();
                  }}
                  type="button"
                  className="bg-indigo-500/10 border-[1px] border-indigo-500 py-1 px-3 text-indigo-600 rounded-lg text-left flex gap-2 items-center"
                >
                  Editar
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
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>
              </td>
              <td className="py-3 px-3 text-sm text-left text-slate-700 flex items-start">
                <Link
                  to={`/view-ingreso/${i?.id}`}
                  className=" bg-slate-500/10 border-[1px] border-slate-500 py-1 px-3 rounded-lg text-left text-slate-700 flex gap-2 items-center"
                >
                  Ver ingreso
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
                      d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                    />
                  </svg>
                </Link>
              </td>

              <td className="py-3 px-3 text-sm text-left text-slate-700">
                <button
                  onClick={() => {
                    handleId(i?.id), openModalEliminar();
                  }}
                  type="button"
                  className="bg-red-500/10 border-[1px] border-red-500 py-1 px-3 rounded-lg text-left text-red-700 flex gap-2 items-center"
                >
                  Eliminar
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
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
  );
};

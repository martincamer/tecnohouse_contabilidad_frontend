import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { usePresupuestosContext } from "../../context/PresupuestosProvider";
import { ModalCrearTotal } from "./ModalCrearTotal";
import { ModalEditarPresupuesto } from "./ModalEditarPresupuesto";
import { ModalEliminar } from "../ui/ModalEliminar";
import { eliminarPresupuesto } from "../../api/presupuestos";

export const ModalPresupuesto = () => {
  const { isOpen, closeModal, presupuestoMensual, setPresupuestoMensual } =
    usePresupuestosContext();
  const [obtenerId, setObtenerId] = useState("");

  const [isOpenEliminar, setIsOpenEliminar] = useState(false);

  const openModalEliminar = () => {
    setIsOpenEliminar(true);
  };

  const closeModalEliminar = () => {
    setIsOpenEliminar(false);
  };

  const [isOpenCrear, setIsOpenCrear] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const openModalCrear = () => {
    setIsOpenCrear(true);
  };

  const closeModalCrear = () => {
    setIsOpenCrear(false);
  };

  const openModalEdit = () => {
    setIsOpenEdit(true);
  };

  const closeModalEdit = () => {
    setIsOpenEdit(false);
  };

  //obtener
  const handleId = (id) => {
    setObtenerId(id);
  };

  const totalSum = presupuestoMensual.reduce((accumulator, currentValue) => {
    return accumulator + parseFloat(currentValue.total);
  }, 0);

  const itemsPerPage = 5; // Cantidad de elementos por página
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResults = presupuestoMensual?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(presupuestoMensual.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const eliminar = async (id) => {
    const res = await eliminarPresupuesto(id);
  };

  return (
    <Menu as="div" className="z-50">
      <ToastContainer />
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
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
              <div className="inline-block w-5/6 p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="space-y-3">
                  <p className="text-indigo-700">Crear presupuesto</p>
                </div>

                <div className="border-slate-300 border-[1px] shadow py-10 px-10 rounded-xl mt-5">
                  <div>
                    <button
                      onClick={() => openModalCrear()}
                      className="bg-indigo-500 rounded-xl shadow py-1 px-4 text-white"
                    >
                      Crear nuevo egreso presupuesto
                    </button>
                  </div>

                  <div className="border-slate-300 border-[1px] shadow rounded-xl mt-5">
                    <table className="w-full">
                      <thead className="divide-y divide-slate-300">
                        <tr className="">
                          <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                            Numero
                          </th>
                          <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                            Tipo/Categoria
                          </th>
                          <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                            Detalle Egreso
                          </th>
                          <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                            Creador
                          </th>
                          <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                            Egreso
                          </th>
                          <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                            Total Egreso
                          </th>
                          <th className="py-4 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                            Editar
                          </th>
                          <th className="py-2 px-2 font-normal uppercase text-sm text-indigo-600 text-left">
                            Eliminar
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 text-left">
                        {currentResults.map((i) => (
                          <tr
                            // key={i.id}
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
                                  handleId(i?.id), openModalEdit();
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

                            <td className="py-3 px-3 text-sm text-left text-slate-700">
                              <button
                                onClick={() => {
                                  handleId(i.id), openModalEliminar();
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
                        ))}{" "}
                      </tbody>
                    </table>
                  </div>

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

                  <div className="mt-5 font-bold text-slate-700">
                    Total del presupuesto estimado
                  </div>
                  <div className="font-bold text-green-600 text-lg">
                    {Number(totalSum).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeModal}
                  >
                    Cerrar Ventana
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
          <ModalCrearTotal
            isOpenCrear={isOpenCrear}
            openModalCrear={openModalCrear}
            closeModalCrear={closeModalCrear}
          />
          <ModalEditarPresupuesto
            obtenerId={obtenerId}
            isOpenEdit={isOpenEdit}
            closeModalEdit={closeModalEdit}
          />

          <ModalEliminar
            isOpenEliminar={isOpenEliminar}
            closeModalEliminar={closeModalEliminar}
            obtenerId={obtenerId}
            eliminar={eliminar}
            texto={"Eliminar Valor"}
            datoUno={presupuestoMensual}
            datoDos={setPresupuestoMensual}
          />
        </Dialog>
      </Transition>
    </Menu>
  );
};

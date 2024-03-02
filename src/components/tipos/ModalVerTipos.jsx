import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useTipoContext } from "../../context/TiposProvider";
import { ModalEditarTipo } from "./ModalEditarTipo";
import { ModalEliminar } from "../ui/ModalEliminar";
import { addSeconds } from "date-fns";
import { eliminarTipo } from "../../api/tipos";
import { ToastContainer } from "react-toastify";

export const ModalVerTipos = () => {
  const { tipos, isOpenTipoVer, closeModalTipoVer, setTipos } =
    useTipoContext();
  const [obtenerId, setObtenerId] = useState("");

  const [isOpenEliminar, setIsOpenEliminar] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const openEdit = () => {
    setIsOpenEdit(true);
  };

  const closeEdit = () => {
    setIsOpenEdit(false);
  };

  const handleId = (id) => {
    setObtenerId(id);
  };

  const openModalEliminar = () => {
    setIsOpenEliminar(true);
  };

  const closeModalEliminar = () => {
    setIsOpenEliminar(false);
  };

  const eliminar = (id) => {
    eliminarTipo(id);
  };

  return (
    <Menu as="div" className="z-50">
      <ToastContainer />
      <Transition appear show={isOpenTipoVer} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModalTipoVer}
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
              <div className="inline-block w-[600px] p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="text-lg text-indigo-500 mb-3 border-b-[1px] uppercase">
                  Tipos creados
                </div>
                <div className="grid grid-cols-4 gap-5">
                  {tipos?.map((t) => (
                    <div
                      className="flex gap-1 items-start justify-center"
                      key={t.id}
                    >
                      <p className="text-slate-700 text-sm">{t.tipo}</p>
                      <svg
                        onClick={() => {
                          handleId(t.id);
                          openEdit();
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-indigo-500 cursor-pointer"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>

                      <svg
                        onClick={() => {
                          handleId(t.id), openModalEliminar();
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-red-400 cursor-pointer"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeModalTipoVer}
                  >
                    Cerrar Ventana
                  </button>
                </div>
              </div>
            </Transition.Child>
            <ModalEditarTipo
              obtenerId={obtenerId}
              isOpenEdit={isOpenEdit}
              closeEdit={closeEdit}
            />
            <ModalEliminar
              datoUno={tipos}
              datoDos={setTipos}
              texto="Desea eliminar el tipo"
              isOpenEliminar={isOpenEliminar}
              closeModalEliminar={closeModalEliminar}
              obtenerId={obtenerId}
              eliminar={eliminar}
            />
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};

import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { usePresupuestosContext } from "../../context/PresupuestosProvider";
import { ModalCrearTotal } from "./ModalCrearTotal";
import { ModalEditarPresupuesto } from "./ModalEditarPresupuesto";

export const ModalPresupuesto = () => {
  const { isOpen, closeModal, presupuestoMensual } = usePresupuestosContext();
  const [obtenerId, setObtenerId] = useState("");

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
              <div className="inline-block w-1/2 p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="space-y-3">
                  <p className="text-indigo-700">INGRESE UN PRESUPUESTO</p>
                </div>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => openModalCrear()}
                    className="bg-indigo-500 text-white text-sm py-1 px-4 rounded-lg shadow"
                  >
                    Crear nuevo valor
                  </button>
                </div>
                <div className="bg-slate-100 border-lg px-2 py-3 rounded-lg shadow shadow-gray-400 mt-5">
                  <p className="font-normal text-slate-700  text-sm">
                    Presupuestos creado del mes
                  </p>
                  <div className="my-5">
                    {presupuestoMensual?.map((p) => (
                      <div key={p.id} className="flex gap-4 items-center">
                        <p className="font-normals text-slate-700 flex flex-col gap-2">
                          Total{" "}
                        </p>

                        <span className="text-indigo-500 font-normal">
                          {Number(p?.total).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          })}
                        </span>

                        <button
                          onClick={() => {
                            handleId(p.id), openModalEdit();
                          }}
                          className="bg-indigo-500/10 text-indigo-600  py-1 px-6 rounded-lg border-[1px] border-indigo-600 text-sm"
                          type="button"
                        >
                          Editar
                        </button>
                      </div>
                    ))}
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
        </Dialog>
      </Transition>
    </Menu>
  );
};

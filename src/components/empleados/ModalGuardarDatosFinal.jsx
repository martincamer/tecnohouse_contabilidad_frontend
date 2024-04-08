import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { editarTipo, obtenerUnicoTipo } from "../../api/fabrica.api";
import { useForm } from "react-hook-form";
import { useEmpleadosContext } from "../../context/EmpleadosProvider";

export const ModalGuardarDatosFinal = ({
  isOpen,
  closeModal,
  handleSubmit,
}) => {
  return (
    <Menu as="div" className="z-50">
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
              <div className="inline-block w-1/3 p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-3xl">
                <div className="text-sm text-slate-800 font-bold mb-3 border-b-[1px] uppercase">
                  GUARDAR LOS DATOS PASO FINAL EMPLEADOS
                </div>

                <div className="py-5">
                  <p className="bg-white border-slate-300 border-[1px] rounded-xl py-3 px-4 shadow text-center text-slate-700">
                    ¿DESEAS GUARDAR LOS DATOS DE LOS EMPLEADOS?
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSubmit()}
                    className="bg-green-100 text-green-700 py-2 px-4 rounded-xl w-full"
                  >
                    GUARDAR LOS DATOS
                  </button>
                  <button className="bg-red-100 text-red-700 py-2 px-4 rounded-xl w-full">
                    CERRAR VENTANA
                  </button>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeModal}
                  >
                    CERRAR
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

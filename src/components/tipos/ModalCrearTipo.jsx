import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { crearTipoNuevo } from "../../api/tipos";
import { useTipoContext } from "../../context/TiposProvider";

export const ModalCrearTipo = () => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  const { closeModalTipo, isOpenTipo, tipos, setTipos } = useTipoContext();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await crearTipoNuevo(data);

      // Verificar si el tipo ya existe antes de agregarlo al estado
      const tipoExistente = tipos.find((tipo) => tipo.id === res.data.id);

      if (!tipoExistente) {
        // Actualizar el estado de tipos agregando el nuevo tipo al final
        setTipos((prevTipos) => [...prevTipos, res.data]);
      }

      toast.success("Tipo creado correctamente!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setTimeout(() => {
        closeModalTipo();
      }, 1000);
    } catch (error) {
      // console.log(error.response.data);
    }
  });

  console.log(tipos);

  return (
    <Menu as="div" className="z-50">
      <ToastContainer />
      <Transition appear show={isOpenTipo} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModalTipo}
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
              <div className="inline-block w-[400px] p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="text-lg text-indigo-500 mb-3 border-b-[1px] uppercase">
                  Crear nuevo valor
                </div>
                <form
                  onSubmit={onSubmit}
                  action=""
                  className="flex flex-col gap-3"
                >
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="text-slate-600">
                      Ingresa el detalle del tipo
                    </label>
                    <input
                      {...register("tipo", { required: true })}
                      type="text"
                      placeholder="Ingresa el detalle del tipo"
                      className="py-2 px-4 border-[1px] border-black/10 rounded-lg shadow shadow-black/10 outline-none"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="bg-indigo-500 py-1 px-4 rounded-lg shadow text-white mt-2"
                    >
                      Crear nuevo tipo
                    </button>
                  </div>
                </form>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeModalTipo}
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

import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useEmpleadosContext } from "../../context/EmpleadosProvider";
import client from "../../api/axios";

export const ModalAumento = ({ isOpen, closeModal }) => {
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const total_aumento = watch("total");

  const { fabricas } = useEmpleadosContext();

  const onSubmit = async (data) => {
    try {
      const res = await client.post("/aumentar-sueldo", data);
      //   toast.success(res.data.message);
      console.log(res.data);

      setTimeout(() => {
        location.reload();
      }, 500);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

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
              <div className="inline-block w-1/2 p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="text-lg text-indigo-500 mb-3 border-b-[1px] uppercase">
                  Aumento de sueldo empleados
                </div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  action=""
                  className="flex flex-col gap-3"
                >
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="text-slate-600">
                      Selecciona la fabrica
                    </label>
                    <select
                      {...register("fabrica", { required: true })}
                      type="text"
                      placeholder="Edita el nombre.."
                      className="py-2 px-4 border-[1px] border-black/10 rounded-lg shadow shadow-black/10 outline-none font-semibold capitalize"
                    >
                      <option className="font-bold text-indigo-500">
                        Seleccionar fabrica del aumento
                      </option>
                      {fabricas.map((f) => (
                        <option className="capitalize font-semibold" key={f.id}>
                          {f.tipo}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="text-slate-600">
                      Seleccionar la quincena del aumento
                    </label>
                    <select
                      {...register("quincena", { required: true })}
                      type="text"
                      className="py-2 px-4 border-[1px] border-black/10 rounded-lg shadow shadow-black/10 outline-none font-semibold capitalize"
                    >
                      <option className="font-bold text-indigo-500">
                        Seleccionar la quincena
                      </option>
                      <option value="quincena_del_cinco">Quincena del 5</option>
                      <option value="quincena_del_veinte">
                        Quincena del 20
                      </option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="text-slate-600">
                      Valor a aumentar
                    </label>
                    <input
                      {...register("total", { required: true })}
                      type="text"
                      placeholder="50000"
                      className="py-2 px-4 border-[1px] border-black/10 rounded-lg shadow shadow-black/10 outline-none font-semibold capitalize"
                    />
                  </div>

                  <div className="flex">
                    <p className="bg-indigo-500 py-2 px-3 rounded text-white font-semibold">
                      {Number(total_aumento || 0).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })}
                    </p>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="bg-indigo-500 py-1 px-4 rounded-lg shadow text-white mt-2"
                    >
                      Generar aumento
                    </button>
                  </div>
                </form>

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
        </Dialog>
      </Transition>
    </Menu>
  );
};

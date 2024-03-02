import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  editarPresupuesto,
  obtenerUnicoPresupuesto,
} from "../../api/presupuestos";
import { useForm } from "react-hook-form";
import { usePresupuestosContext } from "../../context/PresupuestosProvider";

export const ModalEditarPresupuesto = ({
  isOpenEdit,
  closeModalEdit,
  obtenerId,
}) => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  const { presupuestoMensual, setPresupuestoMensual } =
    usePresupuestosContext();

  useEffect(() => {
    async function loadData() {
      const res = await obtenerUnicoPresupuesto(obtenerId);

      setValue("total", res.data.total);
    }

    loadData();
  }, [obtenerId]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const precioUnidadNumerico = parseInt(
        data.total.replace(/[^\d]/g, ""),
        10
      );

      // Actualiza el valor en el objeto data
      data.total = precioUnidadNumerico;

      const res = await editarPresupuesto(obtenerId, data);

      const tipoExistenteIndex = presupuestoMensual.findIndex(
        (tipo) => tipo.id === obtenerId
      );

      console.log("tipoExistenteIndex:", tipoExistenteIndex);

      setPresupuestoMensual((prevTipos) => {
        const newTipos = [...prevTipos];
        const updatedTotal = JSON.parse(res.config.data); // Convierte el JSON a objeto

        newTipos[tipoExistenteIndex] = {
          id: obtenerId,
          total: updatedTotal.total,
          created_at: newTipos[tipoExistenteIndex].created_at,
          updated_at: newTipos[tipoExistenteIndex].updated_at,
        };
        console.log("Estado después de la actualización:", newTipos);
        return newTipos;
      });

      setTimeout(() => {
        closeModalEdit();
      }, 500);

      toast.success("Editar correctamente!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.log(error.response.data);
    }
  });

  return (
    <Menu as="div" className="z-50">
      <ToastContainer />
      <Transition appear show={isOpenEdit} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModalEdit}
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
              <div className="inline-block w-[300px] p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="text-base text-indigo-500 mb-3 border-b-[1px] uppercase">
                  Editar valor
                </div>
                <form onSubmit={onSubmit} action="">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="text-slate-500 text-base">
                      Editar valor
                    </label>
                    <input
                      type="text"
                      placeholder="TOTAL GASTO"
                      {...register("total", {
                        validate: (value) => {
                          const numeroLimpiado = value.replace(/[^0-9]/g, "");
                          return !!numeroLimpiado || "El gasto es requerido";
                        },
                      })}
                      onChange={(e) => {
                        const inputPrecio = e.target.value;

                        // Remover caracteres no numéricos
                        const numeroLimpiado = inputPrecio.replace(
                          /[^0-9]/g,
                          ""
                        );

                        // Formatear como moneda
                        const precioFormateado = new Intl.NumberFormat(
                          "es-CO",
                          {
                            style: "currency",
                            currency: "ARS",
                            minimumFractionDigits: 0,
                          }
                        ).format(numeroLimpiado);

                        // Asignar el valor formateado al campo
                        e.target.value = precioFormateado;
                      }}
                      className="py-2 px-4 border-[1px] border-black/10 rounded-lg shadow shadow-black/10 outline-none"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="bg-indigo-500 py-1 px-4 rounded-lg shadow text-white mt-2 text-sm"
                    >
                      Editar valor
                    </button>
                  </div>
                </form>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeModalEdit}
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

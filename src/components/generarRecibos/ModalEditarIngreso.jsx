import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useIngresosContext } from "../../context/IngresosProvider";
import { editarIngreso, obtenerUnicoIngreso } from "../../api/ingresos";
import { useTipoContext } from "../../context/TiposProvider";

export const ModalEditarIngreso = ({ obtenerId, setDatos, datos }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const { isOpenEditarIngresosTwo, closeModalEditarTwo } = useIngresosContext();

  const { tipos } = useTipoContext();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const precioUnidadNumerico = parseInt(
        data.total.replace(/[^\d]/g, ""),
        10
      );

      // Actualiza el valor en el objeto data
      data.total = precioUnidadNumerico;

      const res = await editarIngreso(obtenerId, data);

      const tipoExistenteIndexTwo = datos.findIndex(
        (tipo) => tipo.id === obtenerId
      );

      setDatos((prevTipos) => {
        const newTipos = [...prevTipos];
        const updatedTipo = JSON.parse(res.config.data); // Convierte el JSON a objeto
        const updatedDetalle = JSON.parse(res.config.data); // Convierte el JSON a objeto
        const updatedTotal = JSON.parse(res.config.data); // Convierte el JSON a objeto

        newTipos[tipoExistenteIndexTwo] = {
          id: obtenerId,
          tipo: updatedTipo.tipo,
          detalle: updatedDetalle.detalle,
          total: updatedTotal.total,
          created_at: newTipos[tipoExistenteIndexTwo].created_at,
          updated_at: newTipos[tipoExistenteIndexTwo].updated_at,
        };
        console.log("Estado después de la actualización:", newTipos);
        return newTipos;
      });

      setTimeout(() => {
        closeModalEditarTwo();
      }, 500);

      toast.success("Ingreso editado correctamente!", {
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
      // console.log(error.response.data);
    }
  });

  useEffect(() => {
    async function loadData() {
      const res = await obtenerUnicoIngreso(obtenerId);

      if (res?.data) {
        // Establecer los valores iniciales en los campos del formulario
        reset({
          detalle: res.data.detalle || "",
          tipo: res.data.tipo || "",
          total: res.data.total || "",
        });
      }
    }

    loadData();
  }, [obtenerId]);

  return (
    <Menu as="div" className="z-50">
      <Transition appear show={isOpenEditarIngresosTwo} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModalEditarTwo}
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
                  Editar valor
                </div>
                <form
                  onSubmit={onSubmit}
                  action=""
                  className="flex flex-col gap-3"
                >
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="text-slate-600">
                      Editar el detalle
                    </label>
                    <input
                      {...register("detalle", { required: true })}
                      type="text"
                      placeholder="Ingresa el detalle"
                      className="py-2 px-4 border-[1px] border-black/10 rounded-lg shadow shadow-black/10 outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="text-slate-600">
                      Seleccionar el tipo
                    </label>
                    <select
                      {...register("tipo", { required: true })}
                      type="text"
                      className="py-2 px-4 border-[1px] border-black/10 rounded-lg shadow shadow-black/10 outline-none"
                    >
                      <option value="">Seleccionar</option>
                      {tipos.map((t) => (
                        <option key={t.id}>{t?.tipo}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="text-slate-600">
                      Ingresar valor
                    </label>
                    <input
                      type="text"
                      placeholder="Ingresa el valor"
                      {...register("total", {
                        validate: (value) => {
                          const numeroLimpiado = value.replace(/[^0-9]/g, "");
                          return !!numeroLimpiado || "El valor es requerido";
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
                      className="bg-indigo-500 py-1 px-4 rounded-lg shadow text-white mt-2"
                    >
                      Editar el ingreso
                    </button>
                  </div>
                </form>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeModalEditarTwo}
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

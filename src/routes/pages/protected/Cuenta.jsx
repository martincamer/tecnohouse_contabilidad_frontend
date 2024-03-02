import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import { ModalCrearUser } from "../../../components/cuenta/ModalCrearUser";
import client from "../../../api/axios";
import { ToastContainer } from "react-toastify";
import { ModalCrearUserEdit } from "../../../components/cuenta/ModalCrearUserEdit";
import { ModalEliminar } from "../../../components/cuenta/ModalEliminar";

export const Cuenta = () => {
  const numero = 677575000;
  const porcentaje = 0.4;

  const resultado = numero * porcentaje;

  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenTwo, setIsOpenTwo] = useState(false);
  const [isOpenEliminar, setIsOpenEliminar] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModalTwo = () => {
    setIsOpenTwo(true);
  };

  const closeModalTwo = () => {
    setIsOpenTwo(false);
  };

  const openModalEliminar = () => {
    setIsOpenEliminar(true);
  };

  const closeModalEliminar = () => {
    setIsOpenEliminar(false);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const response = await client.get("/users");
        setUsers(response.data);
        console.log("Usuarios obtenidos:", response.data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    }

    loadData();
  }, []);

  const [obtenerId, setObtenerId] = useState("");

  const handleId = (id) => {
    setObtenerId(id);
  };

  console.log(obtenerId);

  return (
    <section className="px-10 py-16 w-full flex flex-col gap-5 h-screen">
      <ToastContainer />
      <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm">
        <dl className="-my-3 divide-y divide-gray-100 text-sm">
          <div className="grid grid-cols-1 gap-1 p-3 even:bg-slate-200 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Admin</dt>
            <dd className="text-gray-700 sm:col-span-2 capitalize">
              {user.username}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 even:bg-slate-200 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Email</dt>
            <dd className="text-gray-700 sm:col-span-2 capitalize">
              {user.email}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 even:bg-slate-200 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Ocupacion</dt>
            <dd className="text-gray-700 sm:col-span-2 capitalize">
              {user?.role_id === "1" ? "usuario" : "admin"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="border border-gray-100  shadow-sm py-10 px-10 flex flex-col gap-2">
        <div>
          <p className="text-slate-700">Usuarios creados</p>
        </div>

        <div>
          <button
            onClick={() => openModal()}
            className="bg-indigo-500 py-1 px-4 text-white text-sm rounded-md shadow"
          >
            Crear nuevo usuario
          </button>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-200 mt-5">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="text-left">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold capitalize">
                  Usuario
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold capitalize">
                  Email
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold capitalize">
                  Ocupción
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold capitalize">
                  Eliminar
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 text-left">
              {users?.map((u) => (
                <tr
                  key={u?.username}
                  className="hover:bg-slate-200 cursor-pointer transition-all ease-in-out duration-100"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 capitalize">
                    {u?.username}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 capitalize">
                    {u?.email}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 capitalize">
                    {u?.role_id === 1 ? "admin" : "usuario"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 capitalize">
                    <button
                      onClick={() => {
                        handleId(u.id), openModalTwo();
                      }}
                      className="bg-indigo-500/10 text-indigo-600 text-sm py-1 px-4 rounded-lg shadow border-indigo-600 border"
                    >
                      Editar
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 capitalize">
                    <button
                      onClick={() => {
                        handleId(u.id), openModalEliminar();
                      }}
                      className="bg-red-500/10 text-red-600 text-sm py-1 px-4 rounded-lg shadow border-red-600 border"
                    >
                      Eliminar usuario
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ModalCrearUser isOpen={isOpen} closeModal={closeModal} />
      <ModalCrearUserEdit
        isOpen={isOpenTwo}
        closeModal={closeModalTwo}
        obtenerId={obtenerId}
      />
      <ModalEliminar
        obtenerId={obtenerId}
        isOpen={isOpenEliminar}
        closeModal={closeModalEliminar}
      />
    </section>
  );
};

import React, { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { Link, useLocation } from "react-router-dom";

export const SideBar = () => {
  const [click, setClick] = useState(false);
  const { signout } = useAuth();

  const toggleSidebar = () => {
    setClick(!click);
  };

  const location = useLocation();

  return (
    <div
      className={`flex transition-all ease-in-out duration-500 ${
        click ? "w-1/5" : "w-auto"
      } max-h-full min-h-full z-[100]`}
    >
      <div className="flex w-16 flex-col justify-between border-e bg-white ">
        <div>
          <div className="border-t border-slate-300">
            <div className="px-2">
              <div className="py-4">
                <a
                  onClick={() => toggleSidebar()}
                  href="#"
                  className="t group relative flex justify-center rounded bg-white border-slate-300 border-[1px] px-2 py-1.5 text-slate-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                    />
                  </svg>

                  <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-xl border-slate-300 shadow border-[1px] px-5 py-2 text-xs font-bold uppercase underline text-slate-800 group-hover:visible duration-300">
                    Navegación
                  </span>
                </a>
              </div>

              <ul className="space-y-2 flex flex-col border-t border-slate-300 pt-4">
                <Link to={"/"}>
                  <a
                    href="#"
                    className={`${
                      location.pathname === "/"
                        ? "bg-slate-200 text-slate-700"
                        : "bg-white"
                    } group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-slate-200 hover:text-gray-700`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                      />
                    </svg>

                    <span className="transition-all ease-in-out duration-200 invisible absolute start-full top-1/2 ms-4 -translate-y-1/2  bg-white px-3 py-2 text-sm shadow font-medium text-slate-800 border-[1px] border-slate-300 rounded-xl group-hover:visible flex flex-col gap-1">
                      <div className="underline font-bold uppercase">
                        Inicio
                      </div>
                      <div className="w-[300px]">
                        GENERAR EL PRESUPUESTO ASIGNADO, CREAR DATOS, ETC.
                      </div>
                      <div className=" flex">
                        <div className="bg-green-100 border-green-200 border-[1px] p-1 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-7 h-7 text-green-600"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </div>
                      </div>
                    </span>
                  </a>
                </Link>

                <Link to={"estadistica"}>
                  <a
                    href="#"
                    className={`${
                      location.pathname === "/estadistica"
                        ? "bg-slate-200 text-slate-500"
                        : "bg-white"
                    } group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-slate-200 hover:text-gray-700`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
                      />
                    </svg>

                    <span className="transition-all ease-in-out duration-200 invisible absolute start-full top-1/2 ms-4 -translate-y-1/2  bg-white px-3 py-2 text-sm shadow font-medium text-slate-800 border-[1px] border-slate-300 rounded-xl group-hover:visible flex flex-col gap-1">
                      <div className="underline font-bold uppercase">
                        Estadistica
                      </div>
                      <div className="w-[300px]">
                        VER LAS ESTADISTICAS,EDITARLAS,CREAR NUEVAS,ETC.
                      </div>
                      <div className=" flex">
                        <div className="bg-green-100 border-green-200 border-[1px] p-1 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-7 h-7 text-green-600"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
                            />
                          </svg>
                        </div>
                      </div>
                    </span>
                  </a>
                </Link>

                <Link to={"/empleados"}>
                  <a
                    href="#"
                    className={`${
                      location.pathname === "/empleados"
                        ? "bg-slate-200 text-slate-500"
                        : "bg-white"
                    } group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-slate-200 hover:text-gray-700`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                    <span className="transition-all ease-in-out duration-200 invisible absolute start-full top-1/2 ms-4 -translate-y-1/2  bg-white px-3 py-2 text-sm shadow font-medium text-slate-800 border-[1px] border-slate-300 rounded-xl group-hover:visible flex flex-col gap-1">
                      <div className="underline font-bold uppercase">
                        EMPLEADOS
                      </div>
                      <div className="w-[300px]">
                        CREAR EMPLEADOS,EDITAR,DESCARGAR COMPROBANTES,ETC.
                      </div>
                      <div className=" flex">
                        <div className="bg-indigo-100 border-indigo-200 border-[1px] p-1 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-7 h-7 text-indigo-600"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                            />
                          </svg>
                        </div>
                      </div>
                    </span>
                  </a>
                </Link>

                <Link to={"/cuenta"}>
                  <a
                    href="#"
                    className={`${
                      location.pathname === "/cuenta"
                        ? "bg-slate-200 text-slate-500"
                        : "bg-white"
                    } group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-slate-200 hover:text-gray-700`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>

                    <span className="transition-all ease-in-out duration-200 invisible absolute start-full top-1/2 ms-4 -translate-y-1/2  bg-white px-3 py-2 text-sm shadow font-medium text-slate-800 border-[1px] border-slate-300 rounded-xl group-hover:visible flex flex-col gap-1">
                      <div className="underline font-bold uppercase">
                        CUENTA
                      </div>
                      <div className="w-[300px]">CREAR NUEVAS CUENTAS,ETC</div>
                      <div className=" flex">
                        <div className="bg-indigo-100 border-indigo-200 border-[1px] p-1 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-7 h-7 text-indigo-600"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
                            />
                          </svg>
                        </div>
                      </div>
                    </span>
                  </a>
                </Link>
              </ul>
            </div>
          </div>
        </div>

        <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2">
          <form action="#">
            <button
              //   type="submit"
              type="button"
              onClick={() => signout()}
              className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                />
              </svg>

              <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                Salir de la aplicación
              </span>
            </button>
          </form>
        </div>
      </div>
      {click && (
        <div className="flex h-full flex-1 flex-col justify-between border-e bg-white">
          <div className="px-4 py-8">
            <ul className="mt-14 flex flex-col gap-2">
              <Link to={"/"}>
                <a
                  href="#"
                  className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  Inicio/Crear Datos
                </a>
              </Link>

              <Link to={"/estadistica"}>
                <a
                  href="#"
                  className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  Estadistica
                </a>
              </Link>

              <Link to={"/empleados"}>
                <a
                  href="#"
                  className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  Empleados
                </a>
              </Link>

              <li>
                <details className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                    <span className="text-sm font-medium"> Cuenta </span>

                    <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </summary>

                  <ul className="mt-2 space-y-1 px-4">
                    <li>
                      <Link
                        to="/cuenta"
                        className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      >
                        Ver datos
                      </Link>
                    </li>

                    <li>
                      <Link
                        to={"/"}
                        onClick={() => signout()}
                        className="w-full rounded-lg px-4 py-2 text-sm font-medium text-gray-500 [text-align:_inherit] hover:bg-gray-100 hover:text-gray-700"
                      >
                        Logout
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

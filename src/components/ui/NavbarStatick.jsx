import React from "react";
import { useAuth } from "../../context/AuthProvider";

export const NavbarStatick = () => {
  const { user } = useAuth();

  console.log(user);

  return (
    <div className="absolute top-3 right-5 gap-2 items-start z-[-1] hidden">
      <p className="bg-indigo-500 py-2 px-4 rounded-xl shadow text-white">
        Bienvenido a la aplicación{" "}
        <span className="text-slate-700 bg-white py-[2px] px-2 rounded-lg capitalize">
          {user?.username}
        </span>
      </p>
      <p className="bg-white border-slate-300 border-[1px] py-2 px-4 rounded-xl shadow">
        {" "}
        <span className="bg-white text-slate-700 py-[2px] px-2 rounded-lg capitalize">
          {user?.role_id === "1" ? "usuario" : "admin"}
        </span>
      </p>
    </div>
  );
};

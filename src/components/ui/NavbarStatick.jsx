import React from "react";
import { useAuth } from "../../context/AuthProvider";

export const NavbarStatick = () => {
  const { user } = useAuth();

  console.log(user);

  return (
    <div className="absolute top-2 right-5 flex gap-2 items-start">
      <p className="bg-indigo-500 py-1 px-4 rounded-lg shadow text-white">
        Usuario Logeado{" "}
        <span className="bg-slate-800 text-white py-[2px] px-2 rounded-lg capitalize">
          {user?.username}
        </span>
      </p>
      <p className="bg-indigo-500 py-1 px-4 rounded-lg shadow text-white">
        {" "}
        <span className="bg-slate-800 text-white py-[2px] px-2 rounded-lg capitalize">
          {user?.role_id === "1" ? "usuario" : "admin"}
        </span>
      </p>
    </div>
  );
};

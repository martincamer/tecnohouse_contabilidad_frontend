import React from "react";
import { useAuth } from "../../context/AuthProvider";

export const NavbarStatick = () => {
  const { user } = useAuth();

  console.log(user);

  return (
    <div className="absolute top-3 right-5 flex gap-2 items-start z-[-1]">
      <p className="bg-black py-2 px-4 rounded-xl shadow text-white">
        Usuario Logeado{" "}
        <span className="text-slate-700 bg-white py-[2px] px-2 rounded-lg capitalize">
          {user?.username}
        </span>
      </p>
      <p className="bg-black py-2 px-4 rounded-xl shadow">
        {" "}
        <span className="bg-white text-slate-700 py-[2px] px-2 rounded-lg capitalize">
          {user?.role_id === "1" ? "usuario" : "admin"}
        </span>
      </p>
    </div>
  );
};

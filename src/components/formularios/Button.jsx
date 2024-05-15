import React from "react";

export const Button = ({ type, titulo }) => {
  return (
    <button
      className="bg-indigo-500 py-3 px-6 w-full rounded-full text-white font-bold text-sm  transition-all ease-in-out duration-300 hover:bg-indigo-500/90"
      type={type}
    >
      {titulo}
    </button>
  );
};

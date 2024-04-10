import React from "react";

export const Button = ({ type, titulo }) => {
  return (
    <button
      className="bg-indigo-100 py-3 px-6 w-full rounded-xl text-indigo-600 hover:bg-indigo-500 hover:text-white text-sm  transition-all ease-in-out duration-300"
      type={type}
    >
      {titulo}
    </button>
  );
};

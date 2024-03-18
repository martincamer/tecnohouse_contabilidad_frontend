import React from "react";

export const Button = ({ type, titulo }) => {
  return (
    <button
      className="bg-indigo-500 py-3 px-6 w-full rounded-xl text-white text-sm  transition-all ease-in-out duration-300"
      type={type}
    >
      {titulo}
    </button>
  );
};

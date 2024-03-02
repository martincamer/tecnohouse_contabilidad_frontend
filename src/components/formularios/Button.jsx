import React from "react";

export const Button = ({ type, titulo }) => {
  return (
    <button
      className="bg-indigo-500 py-2 px-6 w-full rounded-lg text-white text-sm hover:bg-indigo-500/10 hover:text-indigo-500 hover:border-[1px] hover:border-indigo-500 transition-all ease-in-out duration-300"
      type={type}
    >
      {titulo}
    </button>
  );
};

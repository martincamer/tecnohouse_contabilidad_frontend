import React from "react";

export const Input = ({ type, placeholder, register }) => {
  return (
    <input
      {...register(type, { required: true })}
      type={type}
      placeholder={placeholder}
      className="rounded-xl py-[8px] px-2 w-full shadow-xl bg-gray-200/50 font-semibold text-slate-700  outline-none  outline-[1px] placeholder:text-sm"
    />
  );
};

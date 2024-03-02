import React from "react";

export const Input = ({ type, placeholder, register }) => {
  return (
    <input
      {...register(type, { required: true })}
      type={type}
      placeholder={placeholder}
      className="rounded-lg py-[8px] px-2 w-full shadow-sm border-gray-300 border-[1px] bg-slate-100 outline-none  outline-[1px] placeholder:text-sm"
    />
  );
};

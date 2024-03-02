export const DatosComponent = ({ title, total, icono }) => {
  return (
    <div className="hover:shadow-black/10 border-slate-300 border-[1px] bg-indigo-100 py-5 px-10 rounded-lg text-indigo-600 shadow-md shadow-slate-100 hover:translate-x-1 transition-all ease-in-out duration-300 cursor-pointer justify-center flex flex-col items-center">
      <p className="font-semibold flex items-center gap-2">
        {title}
        {icono}
      </p>
      <p>{total}</p>
    </div>
  );
};

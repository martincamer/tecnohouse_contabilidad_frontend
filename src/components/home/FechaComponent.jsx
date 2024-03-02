import { useEffect } from "react";
import { useState } from "react";

export const FechaComponent = ({ icono }) => {
  const [dia, setDia] = useState(null);
  const [mes, setMes] = useState(null);

  useEffect(() => {
    const fechaActual = new Date();
    const options = { weekday: "long" };
    const diaActual = fechaActual.toLocaleDateString("es-ES", options);
    const mesActual = fechaActual.toLocaleDateString("es-ES", {
      month: "long",
    });

    setDia(diaActual);
    setMes(mesActual);
  }, []);

  return (
    <div className="bg-slate-300 border-slate-400 border-[1px] py-5 px-10 rounded-lg text-slate-700 shadow-md shadow-slate-100 hover:translate-x-1 transition-all ease-in-out duration-300 cursor-pointer justify-center flex flex-col items-center">
      <p className="font-semibold uppercase flex gap-2 items-center">
        {mes} {icono}
      </p>
      <p className="capitalize">{dia}</p>
    </div>
  );
};

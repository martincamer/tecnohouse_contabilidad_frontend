import { useIngresosContext } from "../../context/IngresosProvider";
import { usePresupuestosContext } from "../../context/PresupuestosProvider";

export const IntroActual = () => {
  const { presupuestoMensual } = usePresupuestosContext();

  const { ingresoMensual } = useIngresosContext();

  // Convertir la propiedad 'total' de string a número usando map
  const ingresosNumericos = ingresoMensual.map((item) => ({
    ...item,
    total: Number(item.total),
  }));

  // Sumar los totales
  const totalIngreso = ingresosNumericos.reduce(
    (acumulador, ingreso) => acumulador + ingreso.total,
    0
  );

  // Obtener la fecha actual
  const fechaActual = new Date();

  // Obtener el día de la semana (0 para domingo, 1 para lunes, ..., 6 para sábado)
  const diaDeLaSemana = fechaActual.getDay();

  // Obtener el día del mes
  const diaDelMes = fechaActual.getDate();

  // Obtener el mes (0 para enero, 1 para febrero, ..., 11 para diciembre)
  const mes = fechaActual.getMonth();

  // Obtener el año
  const ano = fechaActual.getFullYear();

  // Días de la semana en español
  const diasSemana = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];

  // Meses en español
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  // Formatear la fecha
  const fechaFormateada = `${diasSemana[diaDeLaSemana]} ${meses[mes]} / ${diaDelMes} / ${ano}`;

  // Mostrar la fecha formateada
  console.log("Fecha actual:", fechaFormateada);

  return (
    <div className="bg-slate-100 w-full border-[1px] border-slate-300 shadow-sm shadow-slate-400 rounded-lg flex gap-4 items-center justify-center">
      <div className="py-8 px-6 flex flex-col justify-center items-center gap-1 w-full h-full border-r-[1px] border-slate-300">
        <p className="text-indigo-500 text-sm">
          Total del presupuesto estimado
        </p>
        {presupuestoMensual.map((p) => (
          <p className="text-slate-700 text-sm font-semibold">
            {Number(p?.total).toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </p>
        ))}
      </div>

      <div className="py-5 px-6 flex flex-col justify-center items-center gap-1 w-full h-full border-r-[1px] border-slate-300">
        <p className="text-indigo-500 text-sm">
          Gastos del mes{" "}
          <span className="text-slate-700 capitalize">{fechaFormateada}</span>
        </p>
        <p className="text-slate-700 text-sm font-semibold">
          Total:{" "}
          <span className="font-normal text-indigo-500">
            {Number(totalIngreso).toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </span>
        </p>
        <p className="text-slate-700 text-sm font-semibold">
          Cant:{" "}
          <span className="font-normal text-indigo-500">
            {ingresoMensual.length}
          </span>
        </p>
      </div>

      <div className="py-5 px-6 flex flex-col justify-center items-center gap-1 w-full h-full">
        <p className="text-indigo-500 text-sm">Ingreso final</p>
        <p className="text-slate-700 text-sm font-semibold">
          {Number(totalIngreso).toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })}
        </p>
      </div>
    </div>
  );
};

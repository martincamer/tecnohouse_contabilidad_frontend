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

  const totalPresupuestos = presupuestoMensual.reduce(
    (total, p) => total + Number(p?.total),
    0
  );
  const porcentaje = totalPresupuestos / 100; // Si el totalPresupuestos es 105000, esto imprimirá 1050.

  const totalSum = presupuestoMensual.reduce((accumulator, currentValue) => {
    return accumulator + parseFloat(currentValue.total);
  }, 0);

  return (
    <div className="bg-white w-full flex gap-4 items-center justify-center py-5">
      <div className="py-6 px-6 flex flex-col justify-center items-center gap-1 w-full h-full bg-white border-slate-300 border-[1px] rounded-xl shadow">
        <p className="text-slate-800 text-base uppercase">
          Total del presupuesto asignado
        </p>
        <p className="text-slate-900 font-bold text-base">
          {Number(totalSum).toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })}
        </p>
      </div>

      <div className="py-5 px-6 flex flex-col justify-center items-center gap-1 w-full h-full bg-white border-slate-300 border-[1px] rounded-xl shadow">
        <p className="text-slate-800 font-bold text-sm uppercase">
          Egresos generados del mes{" "}
          <span className="text-slate-700 capitalize">{fechaFormateada}</span>
        </p>
        <p className="text-slate-700 uppercase text-sm font-semibold">
          Total en egresos:{" "}
          <span className="font-normal text-green-600">
            {Number(totalIngreso).toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </span>
        </p>
        <p className="text-slate-700 text-sm font-semibold uppercase">
          Cantidad generada:{" "}
          <span className="font-normal text-green-600">
            {ingresoMensual.length}
          </span>
        </p>
      </div>

      <div className="py-6 px-6 flex flex-col justify-center items-center gap-1 w-full h-full bg-white border-slate-300 border-[1px] rounded-xl shadow">
        <p className="text-slate-800 uppercase text-base">Egresos final</p>
        <p className="text-green-600 font-semibold text-base">
          {Number(totalIngreso).toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })}
        </p>
      </div>
    </div>
  );
};

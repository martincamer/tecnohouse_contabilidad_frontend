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
    <div className="bg-white w-full border-[1px] border-slate-300 shadow rounded-xl flex gap-4 items-center justify-center py-5 px-10">
      <div className="py-5 px-6 flex flex-col justify-center items-center gap-1 w-full h-full bg-white border-slate-300 border-[1px] rounded-xl shadow">
        <div class="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          A<span class="text-xs font-medium"> {porcentaje}%</span>
        </div>
        <p className="text-indigo-500 text-sm">
          Total del presupuesto estimado
        </p>
        <p className="text-green-600 font-bold text-base">
          {Number(totalSum).toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })}
        </p>
      </div>

      <div className="py-5 px-6 flex flex-col justify-center items-center gap-1 w-full h-full bg-white border-slate-300 border-[1px] rounded-xl shadow">
        <p className="text-indigo-500 text-sm">
          Egresos generados del mes{" "}
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

      <div className="py-5 px-6 flex flex-col justify-center items-center gap-1 w-full h-full bg-white border-slate-300 border-[1px] rounded-xl shadow">
        <div class="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>

          <span class="text-xs font-medium"> {totalIngreso / 100} %</span>
        </div>
        <p className="text-indigo-500 text-sm">Egreso final</p>
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

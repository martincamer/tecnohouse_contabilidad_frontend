import { PDFDownloadLink } from "@react-pdf/renderer";
import { useIngresosContext } from "../../context/IngresosProvider";
import { usePresupuestosContext } from "../../context/PresupuestosProvider";
import { useTipoContext } from "../../context/TiposProvider";
import { ImprimirPdf } from "../pdf/ImprirmirPdf";

export const Categorias = () => {
  const { openModal, presupuestoMensual } = usePresupuestosContext();
  const { openModalIngresos, ingresoMensual } = useIngresosContext();
  const { openModalTipo, openModalTipoVer } = useTipoContext();

  // Obtener la fecha actual
  const fechaActual = new Date();

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
  const fechaFormateada = `${diasSemana[diaDeLaSemana]}_${meses[mes]}_${diaDelMes}_${ano}`;

  console.log(fechaActual);

  return (
    <div className="bg-white w-full py-4 px-6 border-[1px] border-slate-300 shadow-md rounded-lg flex gap-4">
      <div>
        <button
          className="bg-indigo-500 text-white py-2 px-5 rounded-lg text-sm flex gap-2 items-center hover:translate-x-1 transiton-all ease-in-out duration-100"
          type="button"
          onClick={() => openModalIngresos()}
        >
          Ingreso nuevo
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-[20px]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
            />
          </svg>
        </button>
      </div>

      <div>
        <button
          onClick={() => openModalTipo()}
          className="bg-indigo-500 text-white py-2 px-5 rounded-lg text-sm flex gap-2 items-center hover:translate-x-1 transiton-all ease-in-out duration-100"
          type="button"
        >
          Crear tipo de gasto
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-[20px]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
            />
          </svg>
        </button>
      </div>
      <div>
        <button
          onClick={() => openModalTipoVer()}
          className="bg-indigo-500 text-white py-2 px-5 rounded-lg text-sm flex gap-2 items-center hover:translate-x-1 transiton-all ease-in-out duration-100"
          type="button"
        >
          Editar tipo de gasto
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-[20px]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
            />
          </svg>
        </button>
      </div>
      <div>
        <button
          className="bg-slate-700 text-white py-2 px-5 rounded-lg text-sm flex gap-2 items-center"
          type="button"
        >
          <PDFDownloadLink
            fileName={`planilla_completa_${fechaFormateada}`}
            document={
              <ImprimirPdf
                presupuestoMensual={presupuestoMensual}
                ingresoMensual={ingresoMensual}
              />
            }
          >
            Descargar o imprimir
          </PDFDownloadLink>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
        </button>
      </div>
      <div>
        <button
          onClick={() => openModal()}
          className="bg-slate-700 text-white py-2 px-5 rounded-lg text-sm flex gap-2 items-center"
          type="button"
        >
          Total del presupuesto
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

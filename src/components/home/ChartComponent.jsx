import React, { useEffect, useRef } from "react";
import { usePresupuestosContext } from "../../context/PresupuestosProvider";
import { useIngresosContext } from "../../context/IngresosProvider";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";

import moment from "moment"; // Importa la biblioteca moment para el formateo de fechas

const convertirFecha = (fecha) => {
  return moment(fecha).format("YYYY-MM-DD HH:mm:ss");
};

const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

export const ChartComponent = () => {
  const { ingresoMensual } = useIngresosContext();

  const datosFormateados = ingresoMensual.map((item) => {
    return {
      ...item,
      detalle: item.detalle
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase()), // Capitalize
      created_at: convertirFecha(item.created_at),
      total: item.total,
    };
  });

  console.log("datossss", datosFormateados);

  const totalSuma = datosFormateados.reduce(
    (total, dato) => total + parseInt(dato.total, 10),
    0
  );

  // Calcula la suma total
  const totalSumaTwo = datosFormateados.reduce(
    (total, dato) => total + parseInt(dato.total, 10),
    0
  );

  // Define el porcentaje deseado (30%)
  const porcentajeDeseado = 30;

  // Calcula el valor del porcentaje
  const porcentajeCalculado = (totalSumaTwo * porcentajeDeseado) / 100;

  console.log("asdas", porcentajeCalculado);

  return (
    <div className="flex items-center justify-center relative">
      <div className="bg-white border-[1px] border-slate-300 py-2 px-4 shadow space-y-2 absolute top-[-85px] right-0">
        <p className="text-indigo-600 text-xl">Total en ingresos</p>
        <p className="flex gap-2">
          <span className="text-slate-700 text-lg font-semibold">
            {Number(totalSuma).toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </span>{" "}
          <span className="text-sm text-slate-500">
            +{porcentajeCalculado}%
          </span>
        </p>
      </div>
      <LineChart
        width={1220}
        height={420}
        style={{
          padding: "20px",
          cursor: "pointer",
        }}
        data={datosFormateados}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="created_at" />
        <YAxis />
        <Tooltip
          formatter={(value, name, props) =>
            name === "Detalle"
              ? props.payload.detalle
              : formatoMoneda.format(Number(value))
          }
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="total"
          name="Gastos mensuales (Moneda)"
          stroke="#6366f1"
        />
        <Line
          type="monotone"
          dataKey="detalle"
          name="Detalle"
          stroke="#6366f1"
          dot={false} // Para ocultar los puntos en el gráfico de línea
        >
          <LabelList
            dataKey="detalle"
            position="top"
            content={(props) => (
              <text
                x={props.x}
                y={props.y}
                fill="#6366f1"
                fontSize={12}
                textAnchor="middle"
              >
                {props.value}
              </text>
            )}
          />
        </Line>
        {/* Puedes agregar más líneas según tus necesidades */}
      </LineChart>
    </div>
  );
};

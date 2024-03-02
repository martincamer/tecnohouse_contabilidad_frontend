import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import moment from "moment";
import { useIngresosContext } from "../../context/IngresosProvider";
import { usePresupuestosContext } from "../../context/PresupuestosProvider";

const convertirFecha = (fecha) => {
  return moment(fecha).format("YYYY-MM-DD HH:mm:ss");
};

const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

const formatoNumero = new Intl.NumberFormat("es-AR");

export const ChartComponentColumnTwo = ({ datosFormateados }) => {
  return (
    <BarChart
      width={1220}
      height={500}
      className="w-full mx-auto"
      data={datosFormateados}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="tipo" />
      <Tooltip
        formatter={(value, name) =>
          name === "Porcentaje usado"
            ? `${Number(value).toFixed(2)}%`
            : formatoMoneda.format(Number(value))
        }
      />
      <Legend />

      <Bar dataKey="total" name="Total" fill="#6366f1" />
      <Bar
        dataKey="porcentaje"
        name="Porcentaje usado"
        fill="#82ca9d"
        label={{
          formatter: (valor) => `${Number(valor).toFixed(2)}%`,
          position: "top",
        }}
      />
      <Bar
        dataKey="diferencia"
        name="Diferencia presupuesto estimado"
        fill="#f87171"
      />
    </BarChart>
  );
};

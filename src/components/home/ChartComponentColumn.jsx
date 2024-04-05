import React from "react";
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import moment from "moment";

const convertirFecha = (fecha) => {
  return moment(fecha).format("YYYY-MM-DD HH:mm:ss");
};

const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

const formatoNumero = new Intl.NumberFormat("es-AR");

export const ChartComponentTwo = ({ datosFormateados }) => {
  return (
    <BarChart
      width={620}
      height={500}
      // className="w-full mx-auto"
      data={datosFormateados}
      // margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      style={{
        padding: "10px 20px",
        margin: "0 auto",
        cursor: "pointer",
        width: "100%",
      }}
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

      <Bar dataKey="total" name="Total" fill="#3d3d3d" />
      <Bar
        dataKey="porcentaje"
        name="Porcentaje usado"
        fill="#82ca9d"
        label={{
          formatter: (valor) => `${Number(valor).toFixed(2)}%`,
          position: "top",
        }}
      />
    </BarChart>
  );
};

import React from "react";
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

export const ChartComponentColumnTwo = ({
  // datosFormateados,
  ingresoMensualConPorcentaje,
  presupuestoMensualConPorcentaje,
  diferenciaPorTipoDos,
}) => {
  const datosFormateados = ingresoMensualConPorcentaje.map((item) => {
    const diferenciaItem = diferenciaPorTipoDos.find(
      (diferencia) => diferencia.tipo === item.tipo
    );
    return {
      tipo: item.tipo,
      total: item.total,
      diferencia: diferenciaItem ? diferenciaItem.diferencia : 0,
    };
  });

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

      <Bar dataKey="total" name="Total egresos" fill="#6366f1" />
      {/* <Bar
        dataKey="porcentaje"
        name="Porcentaje"
        fill="#82ca9d"
        label={{
          formatter: (valor) => `${Number(valor).toFixed(2)}%`,
          position: "top",
        }}
      /> */}
      <Bar
        dataKey="diferencia"
        name="Diferencia presupuesto asignado"
        fill="#f87171"
      />
    </BarChart>
  );
};

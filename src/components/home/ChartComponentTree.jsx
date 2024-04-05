import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
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

export const ChartComponentTree = () => {
  const { ingresoMensual } = useIngresosContext();
  const { presupuestoMensual } = usePresupuestosContext();

  const presupuestoTotal = presupuestoMensual.reduce(
    (accumulator, currentValue) => {
      return accumulator + parseFloat(currentValue.total);
    },
    0
  );
  const ingresosTotales = ingresoMensual?.reduce(
    (total, ingreso) => total + parseFloat(ingreso.total || 0),
    0
  );

  const colorBarra = ingresosTotales > presupuestoTotal ? "#990000" : "#3d3d3d";
  const colorTexto = colorBarra === "#ef4444" ? "000000" : "#ffffff";

  const datosFormateados = [
    { tipo: "Presupuesto asignado mensual", total: presupuestoTotal },
    { tipo: "Egresos Mensuales", total: ingresosTotales },
  ];

  return (
    <BarChart
      width={660}
      height={500}
      style={{
        padding: "10px 20px",
        margin: "0 auto",
        cursor: "pointer",
        width: "100%",
      }}
      data={datosFormateados}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="tipo" />
      <YAxis />
      <Tooltip formatter={(value) => formatoMoneda.format(Number(value))} />
      <Legend />
      <Bar
        dataKey="total"
        name="Egresos mensuales/Presupuesto estimado"
        fill={colorBarra}
      >
        <LabelList
          dataKey="total"
          position="top"
          formatter={(value) => formatoMoneda.format(Number(value))}
          style={{ fill: colorTexto }} // Establece el color del texto de la etiqueta
        />
      </Bar>
    </BarChart>
  );
};

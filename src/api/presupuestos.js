import axios from "./axios";

export const crearPresupuestoNuevo = (data) =>
  axios.post("/presupuestos", data);

export const obtenerPresupuestos = () => axios.get("/presupuestos");

export const obtenerPresupuestoMensual = () => axios.get("/presupuestos-mes");

export const editarPresupuesto = (obtenerParams, data) =>
  axios.put(`/presupuestos/${obtenerParams}`, data);

export const obtenerUnicoPresupuesto = (obtenerParams) =>
  axios.get(`/presupuestos/${obtenerParams}`);

export const eliminarPresupuesto = (id) => axios.delete(`/presupuestos/${id}`);

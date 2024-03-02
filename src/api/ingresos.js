import axios from "./axios";

export const crearIngresoNuevo = (data) => axios.post("/ingresos", data);

export const obtenerIngreso = () => axios.get("/ingresos");

export const obtenerIngresoRangoFechas = (fechaInicio, fechaFin) =>
  axios.post("/ingresos/rango-fechas", fechaInicio, fechaFin);

export const obtenerIngresoMensual = () => axios.get("/ingresos-mes");

export const editarIngreso = (obtenerParams, data) =>
  axios.put(`/ingresos/${obtenerParams}`, data);

export const obtenerUnicoIngreso = (id) => axios.get(`/ingresos/${id}`);

export const eliminarIngreso = (id) => axios.delete(`/ingresos/${id}`);

import axios from "./axios";

export const crearNuevoEmpleado = (data) => axios.post("/empleados", data);

export const obtenerEmpleados = () => axios.get("/empleados");

export const actualizarEmpleado = (obtenerId, data) =>
  axios.put(`/empleados/${obtenerId}`, data);

export const obtenerUnicoEmpleado = (id) => axios.get(`/empleados/${id}`);

export const eliminarEmpleado = (id) => axios.delete(`/empleados/${id}`);

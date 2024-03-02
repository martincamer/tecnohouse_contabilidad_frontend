import axios from "./axios";

export const crearTipoNuevo = (data) => axios.post("/tipos", data);

export const obtenerTipos = () => axios.get("/tipos");

export const editarTipo = (obtenerParams, data) =>
  axios.put(`/tipos/${obtenerParams}`, data);

export const obtenerUnicoTipo = (obtenerParams) =>
  axios.get(`/tipos/${obtenerParams}`);

export const eliminarTipo = (id) => axios.delete(`/tipos/${id}`);

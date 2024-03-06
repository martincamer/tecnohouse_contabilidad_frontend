import axios from "./axios";

export const crearTipoNuevo = (data) => axios.post("/fabrica", data);

export const obtenerTipos = () => axios.get("/fabrica");

export const editarTipo = (obtenerParams, data) =>
  axios.put(`/fabrica/${obtenerParams}`, data);

export const obtenerUnicoTipo = (obtenerParams) =>
  axios.get(`/fabrica/${obtenerParams}`);

export const eliminarTipo = (id) => axios.delete(`/fabrica/${id}`);

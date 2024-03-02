import axios from "./axios";

export const crearCategorias = (data) =>
  axios.post("/categoria-accesorios", data);

export const obtenerCategorias = () => axios.get("/categoria-accesorios");

export const editarCategoria = (obtenerId, data) =>
  axios.put(`/categoria-accesorios/${obtenerId}`, data);

export const obtenerUnicaCategoria = (id) =>
  axios.get(`/categoria-accesorios/${id}`);

export const eliminarCategoria = (id) =>
  axios.delete(`/categoria-accesorios/${id}`);

import axios from "./axios";

export const guardarDatosEmpleado = (datos) =>
  axios.post("/empleados-datos", datos);

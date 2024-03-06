//imports
import { createContext, useContext, useEffect, useState } from "react";
import { obtenerEmpleados } from "../api/empleados.api";
import { obtenerTipos } from "../api/fabrica.api";

//context
export const EmpleadosContext = createContext();

//use context
export const useEmpleadosContext = () => {
  const context = useContext(EmpleadosContext);
  if (!context) {
    throw new Error("Use Empleado Propvider");
  }
  return context;
};

export const EmpleadosProvider = ({ children }) => {
  const [empleados, setEmpleados] = useState([]);
  const [fabricas, setFabricas] = useState([]);

  //   const [busqueda, setBusqueda] = useState("");

  //   const handleBusquedaChange = (event) => {
  //     setBusqueda(event.target.value);
  //   };

  //   const resultadosFiltrados = ingresoMensual.filter(
  //     (item) =>
  //       (item.detalle &&
  //         item.detalle.toLowerCase().includes(busqueda.toLowerCase())) ||
  //       (item.codigo &&
  //         item.codigo.toLowerCase().includes(busqueda.toLowerCase()))
  //   );

  //obtener todos los empleados
  useEffect(() => {
    async function loadData() {
      const res = await obtenerEmpleados();

      setEmpleados(res.data);
    }

    loadData();
  }, []);

  //obtener todos los empleados
  useEffect(() => {
    async function loadData() {
      const res = await obtenerTipos();

      setFabricas(res.data);
    }

    loadData();
  }, []);

  return (
    <EmpleadosContext.Provider
      value={{ empleados, setEmpleados, fabricas, setFabricas }}
    >
      {children}
    </EmpleadosContext.Provider>
  );
};

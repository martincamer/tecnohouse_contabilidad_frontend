//imports
import { createContext, useContext, useEffect, useState } from "react";
import {
  obtenerPresupuestoMensual,
  obtenerPresupuestos,
} from "../api/presupuestos";

//context
export const PresupuestosContext = createContext();

//use context
export const usePresupuestosContext = () => {
  const context = useContext(PresupuestosContext);
  if (!context) {
    throw new Error("Use Presupuestos Propvider");
  }
  return context;
};

//
export const PresupuestosProvider = ({ children }) => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [presupuestoMensual, setPresupuestoMensual] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    async function loadData() {
      const res = await obtenerPresupuestos();

      setPresupuestos(res.data);
    }
    loadData();
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await obtenerPresupuestoMensual();
        setPresupuestoMensual(res.data);
      } catch (error) {
        console.error("Error fetching data:", error.response.data);
        // Handle the error (e.g., display an error message)
      }
    }
    loadData();
  }, []); // Include nombreMes in the dependency array if it changes.

  return (
    <PresupuestosContext.Provider
      value={{
        presupuestos,
        isOpen,
        openModal,
        closeModal,
        presupuestoMensual,
        setPresupuestoMensual,
      }}
    >
      {children}
    </PresupuestosContext.Provider>
  );
};

import { createContext, useContext, useEffect, useState } from "react";
import { obtenerTipos } from "../api/tipos";

export const TiposContext = createContext();

export const useTipoContext = () => {
  const context = useContext(TiposContext);
  if (!context) {
    throw new Error("use Tipos propvider");
  }
  return context;
};

export const TiposProvider = ({ children }) => {
  //modales
  const [isOpenTipo, setIsOpenTipo] = useState(false);
  const [isOpenTipoVer, setIsOpenTipoVer] = useState(false);

  const openModalTipo = () => {
    setIsOpenTipo(true);
  };

  const closeModalTipo = () => {
    setIsOpenTipo(false);
  };

  const openModalTipoVer = () => {
    setIsOpenTipoVer(true);
  };

  const closeModalTipoVer = () => {
    setIsOpenTipoVer(false);
  };

  //obtener tipos
  const [tipos, setTipos] = useState([]);
  useEffect(() => {
    async function loadData() {
      const res = await obtenerTipos();

      setTipos(res.data);
    }

    loadData();
  }, []);

  console.log(tipos);

  return (
    <TiposContext.Provider
      value={{
        isOpenTipo,
        openModalTipo,
        closeModalTipo,
        tipos,
        setTipos,
        isOpenTipoVer,
        openModalTipoVer,
        closeModalTipoVer,
      }}
    >
      {children}
    </TiposContext.Provider>
  );
};

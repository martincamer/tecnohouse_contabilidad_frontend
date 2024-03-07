import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { obtenerEmpleados } from "../../api/empleados.api";
import { ImprimirComprobanteDos } from "./ImprimirComprobantesDos";

// import { ImprimirPdf } from "./ImprirmirPdf";

export const ViewPdfTwo = () => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    async function loadData() {
      const res = await obtenerEmpleados();

      setDatos(res.data);
    }

    loadData();
  }, []);

  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <ImprimirComprobanteDos datos={datos} />
    </PDFViewer>
  );
};

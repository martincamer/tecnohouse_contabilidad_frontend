import { PDFViewer } from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerUnicoEmpleado } from "../../api/empleados.api";
import { ImprimirComprobanteCinco } from "../empleados/ImprimirComprobanteCinco";

// import { ImprimirPdf } from "./ImprirmirPdf";

export const ViewPdfCinco = () => {
  const [datos, setDatos] = useState([]);

  const params = useParams();

  useEffect(() => {
    async function loadData() {
      const res = await obtenerUnicoEmpleado(params.id);

      setDatos(res.data);
    }

    loadData();
  }, []);

  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <ImprimirComprobanteCinco datos={datos} />
    </PDFViewer>
  );
};

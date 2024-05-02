import { PDFViewer } from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ImprimirComprobante } from "../empleados/ImprimirComprobante";
import { obtenerUnicoEmpleado } from "../../api/empleados.api";

export const ViewPdf = () => {
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
      <ImprimirComprobante datos={datos} />
    </PDFViewer>
  );
};

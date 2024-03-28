import { PDFViewer } from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import client from "../../api/axios";
import { ImprimirComprobanteMensual } from "../empleados/ImprimirComprobanteMensual";

// import { ImprimirPdf } from "./ImprirmirPdf";

export const ViewPdfMensualDatos = () => {
  const [datos, setDatos] = useState([]);

  const params = useParams();

  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/empleados-datos-particular/${params.id}`);

      setDatos(res.data);
    }

    loadData();
  }, []);

  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <ImprimirComprobanteMensual datos={datos} />
    </PDFViewer>
  );
};

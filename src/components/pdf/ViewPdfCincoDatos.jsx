import { PDFViewer } from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ImprimirComprobanteCinco } from "../empleados/ImprimirComprobanteCinco";
import client from "../../api/axios";

// import { ImprimirPdf } from "./ImprirmirPdf";

export const ViewPdfCincoDatos = () => {
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
      <ImprimirComprobanteCinco datos={datos} />
    </PDFViewer>
  );
};

import { PDFViewer } from "@react-pdf/renderer";
import { ImprimirIngresoUnico } from "./ImprimirIngresoUnico";
import { useParams } from "react-router-dom";
import { obtenerUnicoIngreso } from "../../api/ingresos";
import { useEffect, useState } from "react";

// import { ImprimirPdf } from "./ImprirmirPdf";

export const ViewPdf = () => {
  //obtener datos
  const [datos, setDatos] = useState([]);

  //   params obtener
  const params = useParams();

  console.log(params);

  useEffect(() => {
    async function loadData() {
      const response = await obtenerUnicoIngreso(params.id);

      setDatos(response.data);
    }
    loadData();
  }, []);

  console.log("datos", datos);

  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <ImprimirIngresoUnico datos={datos} />
    </PDFViewer>
  );
};

import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { obtenerUnicoEmpleado } from "../../api/empleados.api";
import { TablaDescargarPdf } from "../estadistica/TablaDescargarPdf";
import client from "../../api/axios";

// import { ImprimirPdf } from "./ImprirmirPdf";

export const EditViewPdf = () => {
  const [egresos, setEgresos] = useState([]);
  const [canjes, setCanjes] = useState([]);
  const [presupuestoAsignado, setPresupuestoAsignado] = useState("");
  const [fechaObtenida, setFechaObtenida] = useState("");

  useEffect(() => {
    async function loadData() {
      const res = await client.get("/datos");

      const resCanjes = await client.get("/datos-canjes");

      const egresosArray = res?.data[0]?.egresos;

      const canjesArray = resCanjes?.data[0]?.datos;

      //   const egresosObject = {};

      //   egresosArray.forEach((egreso, index) => {
      //     egresosObject[index + 1] = egreso;
      //   });

      // Almacenar el objeto de egresos en setEgresos
      //   setEgresos(egresosObject);

      setCanjes(canjesArray || []);
      setEgresos(egresosArray || []);
      setPresupuestoAsignado(res?.data[0]?.presupuestoasignado);
      setFechaObtenida(res?.data[0]?.created_at);
    }

    loadData();
  }, []);

  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <TablaDescargarPdf
        datos={egresos}
        presupuestoAsignado={presupuestoAsignado}
        fechaObtenida={fechaObtenida}
        canjes={canjes}
      />
    </PDFViewer>
  );
};

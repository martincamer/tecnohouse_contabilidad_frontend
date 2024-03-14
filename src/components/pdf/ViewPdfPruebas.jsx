import { PDFViewer } from "@react-pdf/renderer";
import { ImprimirPdfEmpleados } from "../empleados/ImprimirPdfEmpleados";
import { useEmpleadosContext } from "../../context/EmpleadosProvider";

// import { ImprimirPdf } from "./ImprirmirPdf";

export const ViewPdfPruebas = () => {
  const { empleados } = useEmpleadosContext();
  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <ImprimirPdfEmpleados empleados={empleados} />
    </PDFViewer>
  );
};

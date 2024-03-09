//import {}
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import { NotFound } from "./routes/pages/protected/NotFound";
import { Login } from "./routes/pages/Login";
import { Register } from "./routes/pages/Register";
import { Home } from "./routes/pages/protected/Home";
import { SideBar } from "./components/sidebar/Sidebar";
import { GenerarDatos } from "./routes/pages/protected/GenerarDatos";
import { PresupuestosProvider } from "./context/PresupuestosProvider";
import { IngresosProvider } from "./context/IngresosProvider";
import { TiposProvider } from "./context/TiposProvider";
import { ViewPdf } from "./components/pdf/ViewPdf";
import { GenerarRecibos } from "./routes/pages/protected/GenerarRecibos";
import { Cuenta } from "./routes/pages/protected/Cuenta";
import { Estadistica } from "./routes/pages/protected/Estadistica";
import { GenerarRecibosEstadistica } from "./routes/pages/protected/GenerarRecibosEstadistica";
import { NavbarStatick } from "./components/ui/NavbarStatick";
import { ViewIngreso } from "./routes/pages/protected/ViewIngreso";
import { Empleados } from "./routes/pages/protected/Empleados";
import { EmpleadosProvider } from "./context/EmpleadosProvider";
import { CrearNuevoEmpleado } from "./routes/pages/protected/CrearNuevoEmpleado";
import { EditarEmpleado } from "./routes/pages/protected/EditarEmpleado";
import { ViewEmpleado } from "./routes/pages/protected/ViewEmpleado";
import { ViewPdfTwo } from "./components/pdf/ViewPdfTwo";
//import normales
import RutaProtegida from "./layouts/RutaProtejida";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.min.css";
import { ViewPdfPruebas } from "./components/pdf/ViewPdfPruebas";
import { EmpleadosTwo } from "./routes/pages/protected/EmpleadosTwo";
import { DatosGuardados } from "./routes/pages/protected/DatosGuardados";

function App() {
  const { isAuth } = useAuth();

  return (
    <>
      <BrowserRouter>
        <NavbarStatick />
        <Routes>
          <Route
            element={<RutaProtegida isAllowed={!isAuth} redirectTo={"/"} />}
          >
            <Route index path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route
            element={<RutaProtegida isAllowed={isAuth} redirectTo={"/login"} />}
          >
            <Route
              element={
                <PresupuestosProvider>
                  <IngresosProvider>
                    <TiposProvider>
                      <EmpleadosProvider>
                        <main className="flex gap-2 h-full">
                          <SideBar />
                          <Outlet />
                        </main>
                      </EmpleadosProvider>
                    </TiposProvider>
                  </IngresosProvider>
                </PresupuestosProvider>
              }
            >
              <Route index path="/" element={<Home />} />
              <Route path="/generar-datos" element={<GenerarDatos />} />
              <Route path="/generar-recibos" element={<GenerarRecibos />} />
              <Route path="/estadistica" element={<Estadistica />} />
              <Route
                path="/estadistica-recibos"
                element={<GenerarRecibosEstadistica />}
              />
              <Route path="/cuenta" element={<Cuenta />} />
              <Route path="/view-pdf/:id" element={<ViewPdf />} />
              <Route path="/view-pdf-completo" element={<ViewPdfPruebas />} />
              <Route path="/view-pdf/app" element={<ViewPdfTwo />} />
              <Route path="/view-ingreso/:id" element={<ViewIngreso />} />

              <Route path="/empleados" element={<Empleados />} />
              <Route
                path="/empleados-comprobantes"
                element={<EmpleadosTwo />}
              />
              <Route path="/empleado-nuevo" element={<CrearNuevoEmpleado />} />
              <Route path="/editar-empleado/:id" element={<EditarEmpleado />} />
              <Route path="/empleados/:id" element={<ViewEmpleado />} />
              <Route path="/empleados-datos" element={<DatosGuardados />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

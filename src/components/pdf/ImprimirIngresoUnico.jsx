import {
  Document,
  Text,
  View,
  StyleSheet,
  Page,
  Image,
  Font,
} from "@react-pdf/renderer";
import logo from "../../../public/logo.png";
import normal from "../../fonts/Montserrat-Light.ttf";
import semibold from "../../fonts/Montserrat-SemiBold.ttf";
import bold from "../../fonts/Montserrat-Bold.ttf";
import moment from "moment";

Font.register({
  family: "Montserrat",
  fonts: [
    {
      src: normal,
    },
    {
      src: semibold,
      fontWeight: "semibold",
    },
    {
      src: bold,
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({});

// Obtener la fecha actual
const fechaActual = new Date();

// Obtener el día de la semana (0 para domingo, 1 para lunes, ..., 6 para sábado)
const diaDeLaSemana = fechaActual.getDay();

// Obtener el día del mes
const diaDelMes = fechaActual.getDate();

// Obtener el mes (0 para enero, 1 para febrero, ..., 11 para diciembre)
const mes = fechaActual.getMonth();

// Obtener el año
const ano = fechaActual.getFullYear();

// Días de la semana en español
const diasSemana = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

// Meses en español
const meses = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

// Formatear la fecha
const fechaFormateada = `${diasSemana[diaDeLaSemana]} ${meses[mes]} / ${diaDelMes} / ${ano}`;

export const ImprimirIngresoUnico = ({ datos }) => {
  const convertirFecha = (fecha) => {
    return moment(fecha).format("YYYY-MM-DD ");
  };

  // Supongamos que datos.created_at es tu fecha en formato ISO
  const fechaOriginal = datos?.created_at;

  // Crea un objeto Date con la fecha original
  const fecha = new Date(fechaOriginal);

  // Opciones para formatear la fecha (puedes ajustar según tus preferencias)
  const opcionesDeFormato = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };

  // Formatea la fecha según las opciones
  const fechaFormateada = fecha.toLocaleDateString("es-CO", opcionesDeFormato);

  return (
    <Document>
      <Page
        style={{
          padding: "30x 50px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
        size="A4"
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 100,
            }}
            src={logo}
          />
          <Text
            style={{
              textTransform: "capitalize",
              fontSize: "11px",
              fontFamily: "Montserrat",
              fontWeight: "light",
            }}
          >
            {fechaFormateada}
          </Text>
        </View>
        <View
          style={{
            border: "1px solid #000",
            borderRadius: "3px",
            padding: "10px 20px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "3px",
          }}
        >
          <Text
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              fontFamily: "Montserrat",
            }}
          >
            Ingreso Unico
          </Text>
        </View>
        <View
          style={{
            border: "1px solid #000",
            borderRadius: "3px",
            padding: "10px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <Text
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              fontFamily: "Montserrat",
            }}
          >
            Datos del ingreso
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "0px 10px",
          }}
        >
          <Text
            style={{
              textTransform: "capitalize",
              fontFamily: "Montserrat",
              fontWeight: "bold",
              fontSize: "10px",
              display: "flex",
              flexDirection: "row",
              gap: "4px",
            }}
          >
            Fecha de creación{" "}
            <Text
              style={{
                textTransform: "capitalize",
                fontFamily: "Montserrat",
                fontWeight: "normal",
                fontSize: "10px",
              }}
            >
              {fechaFormateada}
            </Text>
          </Text>

          <Text
            style={{
              textTransform: "capitalize",
              fontFamily: "Montserrat",
              fontWeight: "bold",
              fontSize: "10px",
              display: "flex",
              flexDirection: "row",
              gap: "4px",
            }}
          >
            Detalle{" "}
            <Text
              style={{
                textTransform: "capitalize",
                fontFamily: "Montserrat",
                fontWeight: "normal",
                fontSize: "10px",
              }}
            >
              {datos?.detalle}
            </Text>
          </Text>

          <Text
            style={{
              textTransform: "capitalize",
              fontFamily: "Montserrat",
              fontWeight: "bold",
              fontSize: "10px",
              display: "flex",
              flexDirection: "row",
              gap: "4px",
            }}
          >
            Tipo{" "}
            <Text
              style={{
                textTransform: "capitalize",
                fontFamily: "Montserrat",
                fontWeight: "normal",
                fontSize: "10px",
              }}
            >
              {datos?.tipo}
            </Text>
          </Text>

          <Text
            style={{
              textTransform: "capitalize",
              fontFamily: "Montserrat",
              fontWeight: "bold",
              fontSize: "10px",
              display: "flex",
              flexDirection: "row",
              gap: "4px",
            }}
          >
            Usuario{" "}
            <Text
              style={{
                textTransform: "capitalize",
                fontFamily: "Montserrat",
                fontWeight: "normal",
                fontSize: "10px",
              }}
            >
              {datos?.usuario}
            </Text>
          </Text>

          <Text
            style={{
              textTransform: "capitalize",
              fontFamily: "Montserrat",
              fontWeight: "bold",
              fontSize: "10px",
              display: "flex",
              flexDirection: "row",
              gap: "4px",
            }}
          >
            Total del ingreso{" "}
            <Text
              style={{
                textTransform: "capitalize",
                fontFamily: "Montserrat",
                fontWeight: "normal",
                fontSize: "10px",
              }}
            >
              {Number(datos.total).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}
            </Text>
          </Text>
        </View>
      </Page>
    </Document>
  );
};

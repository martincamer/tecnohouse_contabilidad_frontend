import { Document, Text, View, Page, Image, Font } from "@react-pdf/renderer";
import logo from "../../../public/logo.png";
import normal from "../../fonts/Montserrat-Light.ttf";
import semibold from "../../fonts/Montserrat-SemiBold.ttf";
import bold from "../../fonts/Montserrat-Bold.ttf";
import React from "react";

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

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generar un número de factura aleatorio con el formato "0000-XXXX"
function generateInvoiceNumber() {
  const randomNumbers = getRandomNumber(1000, 9999); // Números aleatorios entre 1000 y 9999
  const invoiceNumber = `0000-${randomNumbers}`;
  return invoiceNumber;
}

// Ejemplo de uso
const facturaAleatoria = generateInvoiceNumber();

export const ImprimirComprobantes = ({ datos }) => {
  const fechaFormateadaTwo = new Date(datos.fecha).toLocaleDateString("es-AR");

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        border: "1px solid #000",
        padding: "20px 20px",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 13,
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
            fontSize: "10px",
            fontFamily: "Montserrat",
            fontWeight: "light",
          }}
        >
          {fechaFormateada}
        </Text>
      </View>

      <View
        style={{
          marginTop: "10px",
          borderRadius: "10px",
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: "#000",
          padding: "10px 20px",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              textTransform: "capitalize",
              fontSize: "10px",
              fontFamily: "Montserrat",
              fontWeight: "bold",
            }}
          >
            Pago de haberes - Comprobante Quincena del 20
          </Text>
          <Text
            style={{
              textTransform: "capitalize",
              fontSize: "8px",
              fontFamily: "Montserrat",
              fontWeight: "bold",
            }}
          >
            Numero ° {facturaAleatoria}
          </Text>
        </View>
      </View>

      <View
        style={{
          marginTop: "10px",
          borderRadius: "5px",
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: "#000",
          padding: "10px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "5px",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              backgroundColor: "#000",
              color: "white",
              padding: "5px",
            }}
          >
            <Text
              style={{
                textTransform: "capitalize",
                fontSize: "8px",
                fontFamily: "Montserrat",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              Empleado/a
            </Text>
            <Text
              style={{
                textTransform: "capitalize",
                fontSize: "8px",
                fontFamily: "Montserrat",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              Fecha inicio
            </Text>
            <Text
              style={{
                textTransform: "capitalize",
                fontSize: "8px",
                fontFamily: "Montserrat",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              Antiguedad
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                textTransform: "capitalize",
                fontSize: "8px",
                fontFamily: "Montserrat",
                fontWeight: "normal",
                width: "100%",
              }}
            >
              {datos.empleado}
            </Text>
            <Text
              style={{
                textTransform: "capitalize",
                fontSize: "8px",
                fontFamily: "Montserrat",
                fontWeight: "normal",
                width: "100%",
              }}
            >
              {fechaFormateadaTwo}
            </Text>
            <Text
              style={{
                textTransform: "capitalize",
                fontSize: "8px",
                fontFamily: "Montserrat",
                fontWeight: "normal",
                width: "100%",
              }}
            >
              {datos.antiguedad} años
            </Text>
          </View>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "5px",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              backgroundColor: "#000",
              color: "white",
              padding: "5px",
            }}
          >
            <Text
              style={{
                textTransform: "capitalize",
                fontSize: "8px",
                fontFamily: "Montserrat",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              Tipo de sueldo
            </Text>
            <Text
              style={{
                textTransform: "capitalize",
                fontSize: "8px",
                fontFamily: "Montserrat",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              Fabrica o Suc.
            </Text>
            <Text
              style={{
                textTransform: "capitalize",
                fontSize: "8px",
                fontFamily: "Montserrat",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              Remuneración asignada
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                textTransform: "capitalize",
                fontSize: "8px",
                fontFamily: "Montserrat",
                fontWeight: "normal",
                width: "100%",
              }}
            >
              {datos.tipo}
            </Text>
            <Text
              style={{
                textTransform: "capitalize",
                fontSize: "8px",
                fontFamily: "Montserrat",
                fontWeight: "normal",
                width: "100%",
              }}
            >
              {datos.tipo_fabrica}
            </Text>
            <Text
              style={{
                textTransform: "capitalize",
                fontSize: "8px",
                fontFamily: "Montserrat",
                fontWeight: "normal",
                width: "100%",
              }}
            >
              {Number(Number(datos.total_quincena_veinte)).toLocaleString(
                "es-AR",
                {
                  style: "currency",
                  currency: "ARS",
                }
              )}
            </Text>
          </View>
        </View>
      </View>
      <View>
        <Text
          style={{
            textTransform: "capitalize",
            fontSize: "8px",
            fontFamily: "Montserrat",
            fontWeight: "bold",
            width: "100%",
            marginBottom: "5px",
          }}
        >
          Descuento por faltas/etc{" "}
          {Number(Number(datos.descuento_20)).toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })}{" "}
        </Text>
        <Text
          style={{
            fontSize: "8px",
            fontFamily: "Montserrat",
            fontWeight: "bold",
            width: "100%",
            marginBottom: "5px",
          }}
        >
          Observación por descuentos:{" "}
          <Text
            style={{
              fontSize: "8px",
              fontFamily: "Montserrat",
              fontWeight: "normal",
            }}
          >
            {datos.obs_20}
          </Text>
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            marginTop: "5px",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontSize: "8px",
                fontFamily: "Montserrat",
                fontWeight: "bold",
                marginTop: "5px",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "#000",
                padding: "5px",
              }}
            >
              Sueldo Observación
            </Text>
          </View>
          <View
            style={{
              fontSize: "8px",
              fontFamily: "Montserrat",
              fontWeight: "normal",
              display: "flex",
              flexDirection: "column",
              gap: "1px",
              borderBottom: "1px",
            }}
          >
            <Text>Descuento por faltas/etc </Text>
            <Text
              style={{
                fontSize: "8px",
                fontFamily: "Montserrat",
                fontWeight: "bold",
              }}
            >
              -{datos.descuento_20}
            </Text>
          </View>
          <View
            style={{
              fontSize: "8px",
              fontFamily: "Montserrat",
              fontWeight: "normal",
              display: "flex",
              flexDirection: "column",
              gap: "1px",
              borderBottom: "1px",
            }}
          >
            <Text>Premios</Text>

            <Text
              style={{
                fontSize: "8px",
                fontFamily: "Montserrat",
                fontWeight: "bold",
              }}
            >
              + Premio Comida/Produccion:{" "}
              {Number(datos.comida_produccion).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}{" "}
            </Text>
          </View>
        </View>
        <Text
          style={{
            marginTop: "10px",
            textTransform: "capitalize",
            fontSize: "9px",
            fontFamily: "Montserrat",
            fontWeight: "normal",
            width: "100%",
          }}
        >
          Remuneracion Final
          <Text
            style={{
              marginTop: "10px",
              textTransform: "capitalize",
              fontSize: "9px",
              fontFamily: "Montserrat",
              fontWeight: "bold",
              width: "100%",
            }}
          >
            {" "}
            {Number(Number(datos.total_quincena_veinte)).toLocaleString(
              "es-AR",
              {
                style: "currency",
                currency: "ARS",
              }
            )}
          </Text>
        </Text>
        <Text
          style={{
            marginTop: "10px",
            textTransform: "capitalize",
            fontSize: "9px",
            fontFamily: "Montserrat",
            fontWeight: "normal",
            width: "100%",
          }}
        >
          Pago en mano{" "}
          <Text
            style={{
              marginTop: "10px",
              textTransform: "capitalize",
              fontSize: "9px",
              fontFamily: "Montserrat",
              fontWeight: "bold",
              width: "100%",
            }}
          >
            {Number(datos.total_quincena_veinte).toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </Text>
        </Text>
      </View>

      <View
        style={{
          borderWidth: "0.8px",
          borderColor: "#000",
          borderStyle: "solid",
        }}
      >
        <View
          style={{
            backgroundColor: "#000",
          }}
        >
          <Text
            style={{
              color: "white",
              textTransform: "capitalize",
              fontSize: "9px",
              fontFamily: "Montserrat",
              fontWeight: "bold",
              padding: "8px",
              textAlign: "center",
            }}
          >
            Aclaración del empleador / Firma
          </Text>
        </View>

        <View
          style={{
            padding: "35px 50px",
          }}
        ></View>
      </View>
    </View>
  );
};

const today = new Date();
const formattedDate = today.toLocaleDateString("es-AR"); // Formatea la fecha según el local de Argentina

"Fecha de hoy:", formattedDate;

export const ImprimirComprobantesVeinteTodo = ({ datos }) => {
  return (
    <Document>
      {datos?.map(
        (empleado, index) =>
          empleado.tipo === "quincenal" && (
            <Page key={index} style={{ padding: "30px 50px" }} size="A4">
              <ImprimirComprobantes datos={empleado} />
            </Page>
          )
      )}
    </Document>
  );
};

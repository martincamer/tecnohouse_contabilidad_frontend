import {
  Document,
  Text,
  View,
  StyleSheet,
  Page,
  Image,
  Font,
} from "@react-pdf/renderer";
import { obtenerMes } from "../../../middlewares/mes";
import logo from "../../../public/logo.png";
import normal from "../../fonts/Montserrat-Light.ttf";
import medium from "../../fonts/Montserrat-Medium.ttf";
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
      src: medium,
      fontWeight: "medium",
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

export const TablaDescargarPdf = ({
  datos,
  presupuestoAsignado,
  fechaObtenida,
}) => {
  console.log("DATOS:", datos);

  return (
    <Document>
      <Page
        style={{
          padding: "30x 30px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
        size="A4"
        // orientation="landscape"
      >
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Image
            style={{
              width: "100px",
            }}
            src={logo}
          />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "Montserrat",
                textTransform: "uppercase",
                fontSize: 10,
                fontWeight: "bold",
              }}
            >
              {obtenerMes(fechaObtenida)}
            </Text>
          </View>
          <View
            style={{
              border: "1px solid #000",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: "8px",
                padding: "5px",
                fontFamily: "Montserrat",
                textTransform: "uppercase",
                borderBottom: "1px solid #000",
                width: "100%",
              }}
            >
              Presupuesto{" "}
              <Text
                style={{
                  fontWeight: "medium",
                  textDecoration: "underline",
                }}
              >
                {obtenerMes(fechaObtenida)}
              </Text>
            </Text>
            <View
              style={{
                fontWeight: "bold",
                fontSize: "8px",
                fontFamily: "Montserrat",
                textTransform: "uppercase",
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  padding: "0px 5px",
                }}
              >
                Recaudacioón efectivo + bancos
              </Text>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  fontSize: "9px",
                  borderLeft: "1px solid #000",
                  paddingHorizontal: "5px",
                  padding: "5px",
                }}
              >
                {Number(presupuestoAsignado).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            border: "1px solid #000",
          }}
        >
          <View
            style={{
              padding: "10px",
              borderBottom: "1px solid #000",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat",
                fontSize: "7px",
                paddingHorizontal: "5px",
                fontWeight: "bold",
                width: "20%",
              }}
            >
              TIPO DE EGRESO
            </Text>
            <Text
              style={{
                fontFamily: "Montserrat",
                fontSize: "7px",
                paddingHorizontal: "5px",
                fontWeight: "bold",
                width: "40%",
              }}
            >
              OBS
            </Text>
            <Text
              style={{
                fontFamily: "Montserrat",
                fontSize: "7px",
                paddingHorizontal: "5px",
                fontWeight: "bold",
                width: "10%",
              }}
            >
              %
            </Text>
            <Text
              style={{
                fontFamily: "Montserrat",
                fontSize: "7px",
                paddingHorizontal: "5px",
                fontWeight: "bold",
                width: "20%",
              }}
            >
              PRESUPUESTO
            </Text>
            <Text
              style={{
                fontFamily: "Montserrat",
                fontSize: "7px",
                paddingHorizontal: "5px",
                fontWeight: "bold",
                width: "20%",
              }}
            >
              UTILIZADO REAL
            </Text>
            <Text
              style={{
                fontFamily: "Montserrat",
                fontSize: "7px",
                paddingHorizontal: "5px",
                fontWeight: "bold",
                width: "20%",
              }}
            >
              DIFERENCIA
            </Text>
          </View>
          {datos.map((egreso) => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <Text
                style={{
                  fontFamily: "Montserrat",
                  textTransform: "uppercase",
                  fontSize: "7px",
                  paddingHorizontal: "5px",
                  fontWeight: "bold",
                  width: "20%",
                }}
              >
                {egreso.tipo}
              </Text>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  textTransform: "uppercase",
                  fontSize: "7px",
                  paddingHorizontal: "5px",
                  fontWeight: "medium",
                  width: "40%",
                }}
              >
                {egreso.obs}
              </Text>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  fontSize: "7px",
                  paddingHorizontal: "5px",
                  fontWeight: "medium",
                  width: "10%",
                }}
              >
                {egreso.porcentaje}%
              </Text>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  fontSize: "7px",
                  paddingHorizontal: "5px",
                  fontWeight: "bold",
                  width: "20%",
                }}
              >
                {Number(
                  (egreso.porcentaje * presupuestoAsignado) / 100
                ).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </Text>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  fontSize: "7px",
                  paddingHorizontal: "5px",
                  fontWeight: "bold",
                  width: "20%",
                  backgroundColor: "#0001",
                  paddingVertical: "5px",
                }}
              >
                {Number(egreso.utilizado).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </Text>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  fontSize: "7px",
                  paddingHorizontal: "5px",
                  fontWeight: "medium",
                  width: "20%",
                  backgroundColor: "#0001",
                  paddingVertical: "5px",
                  margin: "0px 2px",
                }}
              >
                {Number(
                  Number((egreso.porcentaje * presupuestoAsignado) / 100) -
                    egreso.utilizado
                ).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

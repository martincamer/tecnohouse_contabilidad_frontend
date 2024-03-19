import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

import logo from "../../../public/logo.png";
import normal from "../../fonts/Montserrat-Light.ttf";
import semibold from "../../fonts/Montserrat-SemiBold.ttf";
import bold from "../../fonts/Montserrat-Bold.ttf";
import { FixedSizeList } from "react-window";
import { Bar } from "react-chartjs-2";

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

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  table: {
    display: "table",
    // width: "auto",
  },
  tableRow: { margin: "auto", flexDirection: "row" },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
  tableHeader: {
    margin: "auto",
    marginTop: 5,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: "20px",
    height: 200, // Reducimos la altura del contenedor del gráfico
    marginTop: 20,
  },
  bar: {
    width: 20, // Reducimos el ancho de las barras
    backgroundColor: "#8884d8",
    margin: 2,
  },
  label: {
    fontSize: 8,
    textAlign: "center",
    marginTop: 2,
  },
});

export const ImprimirEstadisticaPdf = ({
  ingresoMensualConPorcentaje,
  presupuestoMensualConPorcentaje,
  diferenciaPorTipo,
  totalSum,
  totalSumDos,
}) => {
  const obtenerNombreMes = (mesIndex) => {
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
    return meses[mesIndex];
  };

  // Obtener el mes de creación del primer elemento de ingresoMensualConPorcentaje
  const primerElemento = ingresoMensualConPorcentaje[0];
  const fechaCreacion = new Date(primerElemento?.created_at);
  const mesCreacion = fechaCreacion.getMonth();

  return (
    <Document>
      <Page
        style={{
          padding: "20x 20px",
        }}
        size="A4"
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <Image
            style={{
              width: "80px",
            }}
            src={logo}
          />
          <Text
            style={{
              fontWeight: "bold",
              fontFamily: "Montserrat",
              textTransform: "uppercase",
              fontSize: "12px",
            }}
          >
            {/* Aquí se mostrará la fecha de creación */}
            {obtenerNombreMes(mesCreacion)}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              textTransform: "capitalize",
              fontFamily: "Montserrat",
              fontSize: "10px",
            }}
          >
            Total Egresos{" "}
            <Text
              style={{
                fontWeight: "normal",
                fontFamily: "Montserrat",
                fontSize: "10px",
              }}
            >
              {Number(totalSum).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}
            </Text>
          </Text>

          <Text
            style={{
              fontWeight: "bold",
              textTransform: "capitalize",
              fontFamily: "Montserrat",
              fontSize: "10px",
            }}
          >
            Total estimado del presupuesto{" "}
            <Text
              style={{
                fontWeight: "normal",
                fontFamily: "Montserrat",
                fontSize: "10px",
              }}
            >
              {Number(totalSumDos).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}
            </Text>
          </Text>
        </View>
        <View style={styles.container}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text
                style={[
                  styles.tableHeader,
                  {
                    width: "15%",
                    fontSize: "7px",
                    fontFamily: "Montserrat",
                    fontWeight: "bold",
                  },
                ]}
              >
                Tipo
              </Text>
              <Text
                style={[
                  styles.tableHeader,
                  {
                    width: "20%",
                    fontSize: "8px",
                    fontFamily: "Montserrat",
                    fontWeight: "bold",
                  },
                ]}
              >
                Total Presupuesto
              </Text>
              <Text
                style={[
                  styles.tableHeader,
                  {
                    width: "20%",
                    fontSize: "8px",
                    fontFamily: "Montserrat",
                    fontWeight: "bold",
                  },
                ]}
              >
                % Presupuesto
              </Text>
              <Text
                style={[
                  styles.tableHeader,
                  {
                    width: "15%",
                    fontSize: "8px",
                    fontFamily: "Montserrat",
                    fontWeight: "bold",
                  },
                ]}
              >
                Total egresos
              </Text>
              <Text
                style={[
                  styles.tableHeader,
                  {
                    width: "15%",
                    fontSize: "8px",
                    fontFamily: "Montserrat",
                    fontWeight: "bold",
                  },
                ]}
              >
                % egresos
              </Text>
              <Text
                style={[
                  styles.tableHeader,
                  {
                    width: "20%",
                    fontSize: "8px",
                    fontFamily: "Montserrat",
                    fontWeight: "bold",
                  },
                ]}
              >
                Diferencia Presupuesto/Egresos
              </Text>
            </View>
            {ingresoMensualConPorcentaje
              .filter((item) => !item.tipo.startsWith("canjes")) // Filtrar elementos que no comienzan con "canjes"
              .sort((a, b) => b.total - a.total) // Ordenar los elementos por el total de forma descendente
              .map((item) => {
                // Buscar el objeto correspondiente en presupuestoMensualConPorcentaje y diferenciaPorTipo
                const presupuestoItem = presupuestoMensualConPorcentaje.find(
                  (presupuesto) => presupuesto.tipo === item.tipo
                );

                const diferenciaItem = diferenciaPorTipo.find(
                  (diferencia) => diferencia.tipo === item.tipo
                );

                return (
                  <View key={item.tipo} style={styles.tableRow}>
                    <Text
                      style={[
                        styles.tableCell,
                        {
                          width: "15%",
                          fontSize: "8px",
                          fontFamily: "Montserrat",
                          fontWeight: "bold",
                          textTransform: "capitalize",
                        },
                      ]}
                    >
                      {item.tipo}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        {
                          width: "20%",
                          fontSize: "8px",
                          fontFamily: "Montserrat",
                          fontWeight: "bold",
                        },
                      ]}
                    >
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      }).format(presupuestoItem?.total || 0)}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        {
                          width: "15%",
                          fontSize: "8px",
                          fontFamily: "Montserrat",
                          fontWeight: "bold",
                        },
                      ]}
                    >
                      {(presupuestoItem?.porcentajeUsado || 0).toFixed(2)}%
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        {
                          width: "20%",
                          fontSize: "8px",
                          fontFamily: "Montserrat",
                          fontWeight: "bold",
                        },
                      ]}
                    >
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      }).format(item.total)}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        {
                          width: "15%",
                          fontSize: "8px",
                          fontFamily: "Montserrat",
                          fontWeight: "bold",
                        },
                      ]}
                    >
                      {`${(item.porcentajeUsado || 0).toFixed(2)}%`}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        {
                          width: "20%",
                          fontSize: "8px",
                          fontFamily: "Montserrat",
                          fontWeight: "bold",
                        },
                        diferenciaItem?.diferencia < 0 ? { color: "red" } : {},
                      ]}
                    >
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      }).format(diferenciaItem?.diferencia || 0)}
                    </Text>
                  </View>
                );
              })}
          </View>
        </View>

        <View
          style={{
            marginTop: "10px",
            display: "flex",
            flexDirection: "row",
            alignItems: "start",
          }}
        >
          <Text
            style={{
              width: "",
              fontSize: "10px",
              fontFamily: "Montserrat",
              fontWeight: "bold",
              borderBottom: "3px",
              borderBottomWidth: "1px",
            }}
          >
            Egresos por canjes
          </Text>
        </View>
        <View style={styles.container}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text
                style={[
                  styles.tableHeader,
                  {
                    width: "40%",
                    fontSize: "8px",
                    fontFamily: "Montserrat",
                    fontWeight: "bold",
                  },
                ]}
              >
                Tipo
              </Text>
              <Text
                style={[
                  styles.tableHeader,
                  {
                    width: "40%",
                    fontSize: "8px",
                    fontFamily: "Montserrat",
                    fontWeight: "bold",
                  },
                ]}
              >
                Total del egreso
              </Text>
              <Text
                style={[
                  styles.tableHeader,
                  {
                    width: "40%",
                    fontSize: "8px",
                    fontFamily: "Montserrat",
                    fontWeight: "bold",
                  },
                ]}
              >
                % egresos
              </Text>
            </View>
            {ingresoMensualConPorcentaje.map((item) => {
              if (!item.tipo.startsWith("canjes")) {
                // Si el tipo no comienza con "canjes", no mostrar la fila
                return null;
              }

              return (
                <View key={item.tipo} style={styles.tableRow}>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        width: "40%",
                        fontSize: "8px",
                        fontFamily: "Montserrat",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      },
                    ]}
                  >
                    {item.tipo}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        width: "40%",
                        fontSize: "8px",
                        fontFamily: "Montserrat",
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    }).format(item.total)}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        width: "40%",
                        fontSize: "8px",
                        fontFamily: "Montserrat",
                        fontWeight: "bold",
                      },
                    ]}
                  >{`${(item.porcentajeUsado || 0).toFixed(2)}%`}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
};

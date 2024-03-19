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
  console.log("datos", ingresoMensualConPorcentaje);
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
            alignContent: "center",
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
                    fontSize: "7px",
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
            {ingresoMensualConPorcentaje.map((item) => {
              if (item.tipo.startsWith("canjes")) {
                // Si el tipo comienza con "canjes", no mostrar la fila
                return null;
              }

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
                        fontWeight: "normal",
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
                        fontWeight: "normal",
                      },
                    ]}
                  >{`${(item.porcentajeUsado || 0).toFixed(2)}%`}</Text>
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
                        fontWeight: "normal",
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
                        fontWeight: "normal",
                      },
                    ]}
                  >{`${(item.porcentajeUsado || 0).toFixed(2)}%`}</Text>
                </View>
              );
            })}
          </View>
        </View>
        {/* <DataToChart data={data} />
        <View
          style={{
            padding: "30px 20px",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              marginBottom: 20,
              fontFamily: "Montserrat",
              fontWeight: "semibold",
            }}
          >
            Gráfico de Barras
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "flex-start",
              gap: "20px",
              padding: "10px",
            }}
          >
            {ingresoMensualConPorcentaje.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.bar,
                  { height: item.porcentaje, position: "relative" },
                ]}
              >
                <Text
                  style={{
                    fontSize: "8px",
                    position: "absolute",
                    top: "-26",
                  }}
                >
                  {item.tipo}
                </Text>
                <Text>{item.total}</Text>
              </View>
            ))}
          </View>
        </View> */}
      </Page>
    </Document>
  );
};

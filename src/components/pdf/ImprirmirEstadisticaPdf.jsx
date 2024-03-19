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

export const ImprimirEstadisticaPdf = ({
  ingresoMensual,
  presupuestoMensual,
  diferenciaPorTipo,
}) => {
  // Mostrar la fecha formateada
  console.log("Fecha actual:", fechaFormateada);

  // Convertir la propiedad 'total' de string a número usando map
  const ingresosNumericos = ingresoMensual.map((item) => ({
    ...item,
    total: Number(item.total),
  }));

  // Sumar los totales
  const totalIngreso = ingresosNumericos.reduce(
    (acumulador, ingreso) => acumulador + ingreso.total,
    0
  );

  const convertirFecha = (fecha) => {
    return moment(fecha).format("YYYY-MM-DD ");
  };

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
            Presupusto mensual estimado
          </Text>
          {presupuestoMensual?.map((presupuesto) => (
            <Text
              style={{
                fontSize: "12px",
                fontWeight: "normal",
              }}
              key={presupuesto?.id}
            >{`${Number(presupuesto?.total).toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}`}</Text>
          ))}
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
            Estadistica presupuesto / mes
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {ingresoMensual?.map((presupuesto, index) => (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  borderBottom: "1px solid #000",
                  paddingBottom: "5px",
                }}
                key={presupuesto?.id}
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
                      fontFamily: "Montserrat",
                      fontWeight: "bold",
                      fontSize: "10px",
                      textTransform: "capitalize",
                    }}
                  >
                    {presupuesto.tipo}
                  </Text>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Montserrat",
                        fontWeight: "bold",
                        fontSize: "10px",
                        textTransform: "capitalize",
                        borderBottom: "1px solid #000",
                      }}
                    >
                      Diferencia
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Montserrat",
                        fontWeight: "normal",
                        fontSize: "8px",
                        textTransform: "capitalize",
                      }}
                    >
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })?.format(diferenciaPorTipo[index]?.diferencia)}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: "9px",
                    fontWeight: "normal",
                    fontFamily: "Montserrat",
                  }}
                  key={presupuesto?.id}
                >
                  <Text
                    style={{
                      fontSize: "9px",
                      fontWeight: "bold",
                      fontFamily: "Montserrat",
                    }}
                  >
                    Total
                  </Text>{" "}
                  {`${Number(presupuesto?.total).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}`}
                </Text>
                <Text
                  style={{
                    fontSize: "9px",
                    fontWeight: "normal",
                    fontFamily: "Montserrat",
                  }}
                  key={presupuesto?.id}
                >
                  <Text
                    style={{
                      fontSize: "9px",
                      fontWeight: "bold",
                      fontFamily: "Montserrat",
                    }}
                  >
                    Porcentaje
                  </Text>{" "}
                  {`${(presupuesto.porcentaje * 100).toFixed(2)}%`}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={{
            border: "1px solid #000",
            borderRadius: "3px",
            padding: "10px 20px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Text
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              fontFamily: "Montserrat",
            }}
          >
            Resumen final en ingresos
          </Text>
          <Text
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              fontFamily: "Montserrat",
              color: "#000",
              fontWeight: "semibold",
            }}
          >
            {Number(totalIngreso).toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

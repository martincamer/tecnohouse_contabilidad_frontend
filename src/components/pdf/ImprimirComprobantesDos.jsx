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

export const ImprimirComprobantes = ({ datos }) => {
  // Extract employee data from the object
  const {
    fecha,
    tipo,
    total_quincena,
    total_quicena_veinte,
    total_final,
    quincena_del_cinco,
    quincena_del_veinte,
    premio_produccion,
    premio_asistencia,
    comida_produccion,
    tipo_fabrica,
    total_antiguedad,
    banco,
    descuento,
    otros,
    obs,
    antiguedad,
  } = datos;

  const fechaFormateadaTwo = new Date(fecha).toLocaleDateString("es-AR");
  const hoyEsDia = new Date().getDate();

  let mensaje = "";

  if (tipo === "quincenal") {
    if (hoyEsDia >= 1 && hoyEsDia <= 10) {
      mensaje = Number(total_quincena).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      });
    } else if (hoyEsDia >= 11 && hoyEsDia <= 31) {
      mensaje = Number(total_quicena_veinte).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      });
    } else {
      mensaje = "No hay quincena disponible para hoy.";
    }
  } else if (tipo === "mensual") {
    mensaje = Number(total_final).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    });
  } else {
    mensaje = "Tipo de pago no reconocido.";
  }

  let quincenaReal = "";

  if (tipo === "quincenal") {
    if (hoyEsDia >= 1 && hoyEsDia <= 10) {
      quincenaReal = Number(quincena_del_cinco).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      });
    } else if (hoyEsDia >= 11 && hoyEsDia <= 31) {
      quincenaReal = Number(quincena_del_veinte).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      });
    } else {
      quincenaReal = "No hay quincena disponible para hoy.";
    }
  } else if (tipo === "mensual") {
    quincenaReal = Number(quincena_del_cinco).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    });
  } else {
    quincenaReal = "Tipo de pago no reconocido.";
  }

  let mensajes = [];

  if (tipo === "quincenal") {
    if (hoyEsDia >= 1 && hoyEsDia <= 10) {
      mensajes = [
        `Premio Producción: ${Number(premio_produccion).toLocaleString(
          "es-AR",
          {
            style: "currency",
            currency: "ARS",
          }
        )} - `,
        `Premio Asistencia: ${Number(premio_asistencia).toLocaleString(
          "es-AR",
          {
            style: "currency",
            currency: "ARS",
          }
        )}`,
      ];
    } else if (
      hoyEsDia >= 11 &&
      hoyEsDia <= 31 &&
      tipo_fabrica !== "administracion"
    ) {
      mensajes = [
        `Comida: ${Number(comida_produccion).toLocaleString("es-AR", {
          style: "currency",
          currency: "ARS",
        })}`,
      ];
    } else {
      mensajes = ["No hay quincena disponible para hoy."];
    }
  } else if (tipo === "mensual") {
    mensajes = [
      `Premio Asistencia: ${Number(premio_asistencia).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      })}, Comida: ${Number(comida_produccion).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      })} ${
        tipo_fabrica === "gerencia"
          ? `, Premio Producción: ${Number(premio_produccion).toLocaleString(
              "es-AR",
              {
                style: "currency",
                currency: "ARS",
              }
            )}`
          : ""
      }`,
    ];
  } else {
    mensajes = ["Tipo de pago no reconocido."];
  }

  let obsReal = [];

  if (tipo === "quincenal") {
    if (hoyEsDia >= 1 && hoyEsDia <= 10) {
      obsReal = [
        `Premio Producción: ${Number(premio_produccion).toLocaleString(
          "es-AR",
          {
            style: "currency",
            currency: "ARS",
          }
        )}`,
        `Premio Asistencia: ${Number(premio_asistencia).toLocaleString(
          "es-AR",
          {
            style: "currency",
            currency: "ARS",
          }
        )}`,
      ];
    } else if (
      hoyEsDia >= 11 &&
      hoyEsDia <= 31 &&
      tipo_fabrica !== "administracion"
    ) {
      obsReal = [
        `Comida: ${Number(comida_produccion).toLocaleString("es-AR", {
          style: "currency",
          currency: "ARS",
        })}`,
      ];
    } else {
      obsReal = ["No hay quincena disponible para hoy."];
    }
  } else if (tipo === "mensual") {
    obsReal = [
      `Premio Asistencia: ${Number(premio_asistencia).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      })}, Comida: ${Number(comida_produccion).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      })}  ${
        tipo_fabrica === "gerencia"
          ? `, Premio Producción: ${Number(premio_produccion).toLocaleString(
              "es-AR",
              {
                style: "currency",
                currency: "ARS",
              }
            )}`
          : ""
      }`,
    ];
  } else {
    obsReal = ["Tipo de pago no reconocido."];
  }
  const currentDay = new Date().getDate();
  const shouldShowAntiguedadRemunerada = currentDay >= 1 && currentDay <= 11;

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        border: "1px solid #000",
        padding: "20px 20px",
        borderRadius: "10px",
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
          {formattedDate}
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
            Pago de haberes - Comprobante
          </Text>
          <Text
            style={{
              textTransform: "capitalize",
              fontSize: "8px",
              fontFamily: "Montserrat",
              fontWeight: "bold",
            }}
          >
            Numero ° {Math.floor(Math.random() * 1000)}
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
        {/* Employee information section */}
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
              {antiguedad} años
            </Text>
          </View>
        </View>

        {/* Payment details section */}
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
              {tipo}
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
              {tipo_fabrica}
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
              {mensaje}
            </Text>
          </View>
        </View>

        {/* Other details section */}
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
              Otros / etc
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
                fontSize: 8,
                fontFamily: "Montserrat",
                fontWeight: "normal",
                width: "100%",
              }}
            >
              {hoyEsDia >= 1 && hoyEsDia <= 10
                ? Number(banco).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })
                : null}
            </Text>
          </View>
        </View>

        {/* Additional information and deductions section */}
        <View>
          {descuento && otros > 0 && (
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
              Descuento por faltas / banco{" "}
              {Number(descuento + otros).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}{" "}
            </Text>
          )}

          {descuento && otros > 0 && (
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
                {obs}
              </Text>
            </Text>
          )}

          <Text>
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
              Extras:{" "}
            </Text>

            <Text
              style={{
                fontSize: "8px",
                fontFamily: "Montserrat",
                fontWeight: "normal",
              }}
            >
              {mensajes}
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
                -{descuento}
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

              {obsReal.map((d, index) => (
                <Text
                  key={index}
                  style={{
                    fontSize: "8px",
                    fontFamily: "Montserrat",
                    fontWeight: "bold",
                  }}
                >
                  + {d}
                </Text>
              ))}
            </View>

            {shouldShowAntiguedadRemunerada && (
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
                <Text>Antiguedad remunerada</Text>
                <Text
                  style={{
                    fontSize: "8px",
                    fontFamily: "Montserrat",
                    fontWeight: "bold",
                  }}
                >
                  +{" "}
                  {Number(total_antiguedad).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </Text>
              </View>
            )}

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
              <Text>Otros/Bancos/etc</Text>
              <Text
                style={{
                  fontSize: "8px",
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                }}
              >
                +{" "}
                {hoyEsDia >= 1 && hoyEsDia <= 10
                  ? Number(otros).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })
                  : null}
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
              <Text>Descuentos Banco</Text>
              <Text
                style={{
                  fontSize: "8px",
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                }}
              >
                -{" "}
                {Number(otros).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
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
              <Text>Monto</Text>
              <Text
                style={{
                  fontSize: "8px",
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                }}
              >
                {quincenaReal}
              </Text>
            </View>
          </View>

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
            Remuneracion Final<Text> {mensaje} </Text>
          </Text>
        </View>

        {/* Employer clarification / signature section */}
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
              Empleador
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: "9px",
                fontFamily: "Montserrat",
                fontWeight: "bold",
              }}
            >
              Firma y aclaracion
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const today = new Date();
const formattedDate = today.toLocaleDateString("es-AR"); // Formatea la fecha según el local de Argentina

"Fecha de hoy:", formattedDate;

export const ImprimirComprobanteDos = ({ datos }) => {
  return (
    <Document>
      {datos?.map((empleado, index) => (
        <Page key={index} style={{ padding: "30px 50px" }} size="A4">
          <ImprimirComprobantes datos={empleado} />
        </Page>
      ))}
    </Document>
  );
};

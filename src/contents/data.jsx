import { FaArrowsUpDown } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { BiSolidAddToQueue } from "react-icons/bi";
import { BsArrowDownUp, BsFillBoxFill } from "react-icons/bs";
import { AiFillFilePdf, AiFillInfoCircle } from "react-icons/ai";

export const CARDATOS = [
  {
    id: 0,
    title: "Control de stock en un click",
    desc: "Controlá el stock rápidamente y evitá faltantes. Ordená tu local y prevení robos.",
    value: "Conoce más",
  },
  {
    id: 1,
    title: "Facturacion y ventas en segundos",
    desc: "Utilizá factura electrónica o presupuestos para clientes",
    value: "Conoce más",
  },
  {
    id: 2,
    title: "Administración en un solo lugar",
    desc: "Ahorrá tiempo dejando la libreta o el excel, centralizá todos tus gastos",
    value: "Conoce más",
  },
];
export const CARDATOSTWO = [
  {
    id: 0,
    title: "El software es fácil de usar",
    desc: "Intuitivo y rápido. Todos lo pueden usar,aprendelo en minutos y empezá a usarlo.",
    icono: <FaArrowsUpDown className="text-3xl text-terciary" />,
  },
  {
    id: 1,
    title: "Pensado para empresas de stock y facturación",
    desc: "Desarrollado para cubrir las necesidades de los pequeños y medianos comerciantes, cadenas y franquicias.",
    icono: <BiSolidAddToQueue className="text-3xl text-terciary" />,
  },
  {
    id: 2,
    title: "Soporte Técnico",
    desc: "Soporte por chat y mail además de videos tutoriales.",
    icono: <FaUserAlt className="text-3xl text-terciary" />,
  },
];
export const CARDATOSTREE = [
  {
    id: 0,
    title: "Ultimos movimientos",
    desc: "Observe los movimientos de todos sus productos. Conozca las entradas y salidas de los depósitos, de su local o locales y no pierda detalles.",
    icono: <BsArrowDownUp className="text-3xl text-green-400 font-extrabold" />,
  },
  {
    id: 1,
    title: "Carga masiva de stock",
    desc: "El programa permite realizar cargas masivas de todos sus productos de manera sencilla y rápida para que no pierda tiempo en realizarlo manualmente.",
    icono: <BsFillBoxFill className="text-3xl text-green-400 font-extrabold" />,
  },
  {
    id: 2,
    title: "Presupuesto y Facturacion",
    desc: "El programa te permite facturar y hacer presupuestos para tus clientes.",
    icono: <AiFillFilePdf className="text-3xl text-green-400 font-extrabold" />,
  },
  {
    id: 3,
    title: "Informe de ventas",
    desc: "Realice informes sobre las ventas de sus productos, marca y conozca cuales son las tendencias para aumentar las oportunidades de venta.",
    icono: (
      <AiFillInfoCircle className="text-3xl text-green-400 font-extrabold" />
    ),
  },
  {
    id: 4,
    title: "Estado de los clientes",
    desc: "Realice informes sobre las ventas de sus productos, marca y conozca cuales son las tendencias para aumentar las oportunidades de venta.",
    icono: <FaUserAlt className="text-3xl text-green-400 font-extrabold" />,
  },
];

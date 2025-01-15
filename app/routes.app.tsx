import React from "react";

import { Icon } from "@chakra-ui/react";
import { MdBusiness, MdHome, MdOutlineReceipt, MdPointOfSale, MdShoppingCart, MdVideoLibrary } from "react-icons/md";
import { IoMdCube } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "/app",
    match: /^\/app$/,
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
  },
  {
    name: "Prodotti",
    layout: "/admin",
    path: "/app/products",
    match: /^\/app\/products(\/.*)?$/,
    icon: <Icon as={IoMdCube} width="20px" height="20px" color="inherit" />,
  },
  {
    name: "Crea Prodotto",
    path: "/app/products/new",
    match: /^\/app\/products\/new$/,
  },
  {
    name: "Modifica Profilo",
    path: "/app/settings/user",
    match: /^\/app\/settings\/user$/,
  },
  {
    name: "Punti Vendita",
    layout: "/admin",
    path: "/app/pos",
    match: /^\/app\/pos(\/.*)?$/,
    icon: (
      <Icon as={MdPointOfSale} width="20px" height="20px" color="inherit" />
    ),
  },
  {
    name: "Vendite",
    layout: "/admin",
    path: "/app/sales",
    match: /^\/app\/sales(\/.*)?$/,
    icon: (
      <Icon as={MdOutlineReceipt} width="20px" height="20px" color="inherit" />
    ),
  },
  {
    name: "Documenti",
    layout: "/admin",
    path: "/app/documents",
    match: /^\/app\/documents(\/.*)?$/,
    icon: <Icon as={IoDocuments} width="20px" height="20px" color="inherit" />,
  },
  {
    target: '_blank',
    name: "Acquista",
    layout: "/admin",
    path: "https://secureprivacy.thrivecart.com/paytomorrow-abbonamento",
    icon: <Icon as={MdShoppingCart} width="20px" height="20px" color="inherit" />,
  },
  {
    target: '_blank',
    name: "Guadagna con noi",
    layout: "/admin",
    path: "https://form.typeform.com/to/F3TB2OVv",
    icon: <Icon as={MdBusiness} width="20px" height="20px" color="inherit" />,
  },
  {
    target: '_blank',
    name: "Video spiegazione PayTomorrow",
    layout: "/admin",
    path: "https://www.youtube.com/@Legconsulenze",
    icon: <Icon as={MdVideoLibrary} width="20px" height="20px" color="inherit" />,
  }
];

export default routes;

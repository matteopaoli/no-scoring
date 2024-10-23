import React from "react";

import { Icon } from "@chakra-ui/react";
import { MdHome, MdPointOfSale } from "react-icons/md";
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
    name: "Vendite",
    layout: "/admin",
    path: "/app/sales",
    match: /^\/app\/sales(\/.*)?$/,
    icon: (
      <Icon as={MdPointOfSale} width="20px" height="20px" color="inherit" />
    ),
  },
  {
    name: "Documenti",
    layout: "/admin",
    path: "/app/documents",
    match: /^\/app\/documents(\/.*)?$/,
    icon: <Icon as={IoDocuments} width="20px" height="20px" color="inherit" />,
  },
];

export default routes;

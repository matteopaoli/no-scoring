import React from "react";

import { Icon } from "@chakra-ui/react";
import { MdHandshake, MdHome, MdPointOfSale } from "react-icons/md";
import { IoMdCube } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";

const routes = [
  {
    name: "Dashboard",
      layout: "/admin",
    path: "/partner",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    sidebar: true
  },
  {
    name: "Agenti",
    layout: "/admin",
    path: "/partner/subpartners",
    icon: <Icon as={MdHandshake} width="20px" height="20px" color="inherit" />,
    sidebar: true
  },
  {
    name: "Crea Prodotto",
    path: "/app/products/new",
  },
  {
    name: "Modifica Profilo",
    path: "/app/settings/user",
  },
  {
    name: "Vendite",
    path: "/app/sales",
    icon: (
      <Icon as={MdPointOfSale} width="20px" height="20px" color="inherit" />
    ),
    sidebar: true
  },
];

export default routes;

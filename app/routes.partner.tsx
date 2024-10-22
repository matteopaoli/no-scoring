import React from "react";

import { Icon, layout } from "@chakra-ui/react";
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
    name: "Modifica Profilo",
    path: "/partner/settings/user",
  },
  {
    name: "Commercianti",
    layout: '/admin',
    path: "/partner/merchants",
    icon: (
      <Icon as={MdPointOfSale} width="20px" height="20px" color="inherit" />
    ),
    sidebar: true
  },
];

const subpartnerRoutes = [...routes].filter(route => route.path !== '/partner/subpartners')

export { routes, subpartnerRoutes};

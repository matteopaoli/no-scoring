import React from "react";

import { Icon, layout } from "@chakra-ui/react";
import { MdHandshake, MdHome, MdPointOfSale, MdVideoLibrary } from "react-icons/md";
import { IoMdCube } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";

const routes = [
  // {
  //   name: "Dashboard",
  //   layout: "/admin",
  //   path: "/partner",
  //   icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
  //   sidebar: true
  // },
  {
    name: "Agenti",
    layout: "/admin",
    path: "/partner/subpartners",
    icon: <Icon as={MdHandshake} width="20px" height="20px" color="inherit" />,
    match: /^\/partner\/subpartners(\/.*)?$/,
    sidebar: true
  },
  {
    name: "Modifica Profilo",
    path: "/partner/settings/user",
  },
  {
    name: "Crea nuovo agente",
    path: "/partner/subpartners/new",
  },
  {
    name: "Dettagli Agente",
    path: "/partner/subpartners/[id]",
  },
  {
    name: "Commercianti",
    layout: '/admin',
    path: "/partner/merchants",
    match: /^\/partner\/merchants(\/.*)?$/,
    icon: (
      <Icon as={MdPointOfSale} width="20px" height="20px" color="inherit" />
    ),
    sidebar: true
  },
  {
    name: "Documenti",
    layout: "/admin",
    path: "/partner/documents",
    match: /^\/partner\/documents(\/.*)?$/,
    icon: <Icon as={IoDocuments} width="20px" height="20px" color="inherit" />,
    sidebar: true
  },
  {
    target: '_blank',
    name: "Video spiegazione PayTomorrow",
    layout: "/admin",
    path: "https://www.youtube.com/@Legconsulenze",
    icon: <Icon as={MdVideoLibrary} width="20px" height="20px" color="inherit" />,
  }
];

const subpartnerRoutes = [...routes].filter(route => route.path !== '/partner/subpartners')

export { routes, subpartnerRoutes};

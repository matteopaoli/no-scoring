import { Icon } from "@chakra-ui/react";
import { MdPointOfSale } from "react-icons/md";

const routes = [
  {
    name: "Modalità POS",
    path: "/pos/view",
    layout: '/admin',
    match: /^\/pos\/view$/,
    icon: <Icon as={MdPointOfSale} width="20px" height="20px" color="inherit" />,
  },
  {
    name: "Impostazioni",
    path: "/pos/settings",
    match: /^\/pos\/settings$/,
  }
];

export default routes;

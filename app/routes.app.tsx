import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdOutlineVerifiedUser,
  MdPointOfSale,
} from 'react-icons/md';

import { IoMdCube } from "react-icons/io";

const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: '/app',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
  },
  {
    name: 'Prodotti',
    layout: '/admin',
    path: '/app/products',
    icon: <Icon as={IoMdCube} width="20px" height="20px" color="inherit" />,
  },
  {
    name: 'Crea Prodotto',
    path: '/app/products/new',
  },
  {
    name: 'Modifica Profilo',
    path: '/app/settings/user',
  },
  {
    name: 'Vendite',
    layout: '/admin',
    path: '/app/sales',
    icon: <Icon as={MdPointOfSale} width="20px" height="20px" color="inherit" />,
  }
];

export default routes;

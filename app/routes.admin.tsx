import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdOutlineVerifiedUser,
} from 'react-icons/md';
import { FaHandshake } from 'react-icons/fa';

const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: '/admin',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    sidebar: true,
  },
  {
    name: 'Utenti',
    layout: '/admin',
    path: '/admin/users',
    icon: (
      <Icon
        as={MdOutlineVerifiedUser}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    sidebar: true,
  },
  {
    name: 'Partner',
    layout: '/admin',
    icon: <Icon as={FaHandshake} width="20px" height="20px" color="inherit" />,
    path: '/admin/partners',
    sidebar: true,
  },
  {
    name: 'Categorie clienti',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/admin/business-types',
    sidebar: true,
  },
  {
    name: "Modifica Profilo",
    path: "/admin/settings/user",
  },
  {
    name: "Crea Nuovo Partner",
    path: "/admin/partners/new",
    breadcrumb: [{ url: '/admin/partners', text: 'Partner' }],
  },
  {
    name: "Crea Nuovo Utente",
    path: "/admin/users/new",
    breadcrumb: [{ url: '/admin/users', text: 'Utenti' }],
  },
  {
    name: "Dettagli Partner",
    path: "/admin/partners/[id]",
    breadcrumb: [{ url: '/admin/partners', text: 'Partner' }],
    params: ['partnerId'], // Specify parameter requirements
  },
];

export default routes;

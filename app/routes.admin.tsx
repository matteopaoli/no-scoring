import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdOutlineVerifiedUser,
  MdStore
} from 'react-icons/md';
import { FaHandshake } from 'react-icons/fa';

const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: '/admin',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    sidebar: true,
    match: /^\/admin$/,
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
    match: /^\/admin\/users(\/.*)?$/,
  },
  {
    name: "Modifica Utente",
    path: "/admin/users/edit/[id]",
  },
  {
    name: "Dettagli Partner",
    path: "/admin/partners/[id]",
  },
  {
    name: 'Negozi',
    layout: '/admin',
    path: '/admin/stores',
    icon: <Icon as={MdStore} width="20px" height="20px" color="inherit" />,
    sidebar: true,
    match: /^\/admin\/stores(\/.*)?$/,
  },  
  {
    name: 'Partner',
    layout: '/admin',
    icon: <Icon as={FaHandshake} width="20px" height="20px" color="inherit" />,
    path: '/admin/partners',
    sidebar: true,
    match: /^\/admin\/partners(\/.*)?$/,
  },
  {
    name: 'Categorie clienti',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/admin/business-types',
    sidebar: true,
    match: /^\/admin\/business-types(\/.*)?$/,
  },
  {
    name: "Modifica Profilo",
    path: "/admin/settings/user",
    match: /^\/admin\/settings\/user$/,
  },
  {
    name: "Crea Nuovo Partner",
    path: "/admin/partners/new",
    breadcrumb: [{ url: '/admin/partners', text: 'Partner' }],
    match: /^\/admin\/partners\/new$/,
  },
  {
    name: "Crea Nuovo Utente",
    path: "/admin/users/new",
    breadcrumb: [{ url: '/admin/users', text: 'Utenti' }],
    match: /^\/admin\/users\/new$/,
  },
  {
    name: "Dettagli Partner",
    path: "/admin/partners/[id]",
    breadcrumb: [{ url: '/admin/partners', text: 'Partner' }],
    params: ['partnerId'],
    match: /^\/admin\/partners\/[^/]+$/,
  },
];

export default routes;

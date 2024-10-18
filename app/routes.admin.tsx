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
    secondary: true,
  },
  {
    name: 'Partner',
    layout: '/admin',
    icon: <Icon as={FaHandshake} width="20px" height="20px" color="inherit" />,
    path: '/admin/partners',
  },
  {
    name: 'Categorie clienti',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/admin/business-types',
  },
  {
    name: "Modifica Profilo",
    path: "/admin/settings/user",
  },
  {
    name: "Crea Nuovo Partner",
    path: "/admin/partners/new",
  },
  // {
  //   name: 'Profile',
  //   layout: '/admin',
  //   path: '/profile',
  //   icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
  //   component: <Profile />,
  // },
];

export default routes;

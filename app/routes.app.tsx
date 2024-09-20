import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdOutlineVerifiedUser,
} from 'react-icons/md';

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
    name: 'Data Tables',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/data-tables',
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
  },
];

export default routes;

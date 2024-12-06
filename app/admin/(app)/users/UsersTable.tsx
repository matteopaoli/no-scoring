"use client";
/* eslint-disable */

import {
  Box,
  Button,
  Flex,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
} from "@chakra-ui/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  MdOutlineEdit,
  MdDeleteOutline,
  MdHourglassEmpty,
  MdCheckCircle,
} from "react-icons/md";
import Card from "@/app/components/card/Card";
import Menu from "./UsersTableMenu";
import { useMemo, useState } from "react";
import { User } from "@/app/db";
import { Link } from "@chakra-ui/next-js";
import CopyButton from "@/app/components/CopyButton";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import GenericTable from "@/app/components/GenericTable";
import DeleteUserButton from "./DeleteUserButton";

type UsersTableProps = {
  tableData: unknown[];
};

const columnHelper = createColumnHelper();

export default function UsersTable({ tableData }: UsersTableProps) {
  const columns = useMemo(
    () => [
      {
        accessorKey: "refName",
        header: "Nome Referente",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "storeName",
        header: "Negozio",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "phoneNumber",
        header: "Telefono",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "provincia",
        header: "Provincia",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "partnerName",
        header: "Partner",
        cell: (info) =>
          (info.getValue() as string).trim() ? info.getValue() : "—",
      },
      {
        accessorKey: "totalCommission",
        header: "Commissioni guadagnate",
        cell: (info) => Number(info.getValue()).toFixed(2),
      },
      {
        accessorKey: "totalCommissionCurrentMonth",
        header: "Commssioni guadagnate (mese corrente)",
        cell: (info) => `€ ${Number(info.getValue()).toFixed(2)}`,
      },
      {
        accessorKey: "totalVolume",
        header: "Volume totale",
        cell: (info) => `€ ${Number(info.getValue()).toFixed(2)}`,
      },
      {
        accessorKey: "totalVolumeCurrentMonth",
        header: "Volume (mese corrente)",
        cell: (info) => `€ ${Number(info.getValue()).toFixed(2)}`,
      },
      {
        accessorKey: "actions",
        header: "",
        cell: (info) => (
          <>
            <Tooltip label="Modifica utente" hasArrow placement="auto">
              <Link href={`/admin/users/edit/${info.row.original.id}`}>
                <Icon
                  as={MdOutlineEdit}
                  width="20px"
                  height="20px"
                  color="inherit"
                  cursor="pointer"
                />
              </Link>
            </Tooltip>
            <DeleteUserButton userId={info.row.original.id} />
          </>
        ),
      },
    ],
    []
  );

  return (
    <>
      <GenericTable
        columns={columns}
        data={tableData}
        title="Merchant attivi"
        itemsPerPage={100}
        menu={Menu}
      />
    </>
  );
}

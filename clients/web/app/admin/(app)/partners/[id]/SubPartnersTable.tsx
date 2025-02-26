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
} from "@chakra-ui/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import Card from "@/app/components/card/Card";
import { useMemo, useState } from "react";
import { Link } from "@chakra-ui/next-js";
import { useRouter } from "next/navigation";
import GenericTable from "@/app/components/GenericTable";

type SubPartnersTableProps = {
  tableData: {
    firstName: string | null;
    lastName: string | null;
    provincia: string | null;
    email: string | null;
    totalCommission: number;
  }[];
};

const columnHelper = createColumnHelper<{
  firstName: string | null;
  lastName: string | null;
  provincia: string | null;
  email: string | null;
  totalCommission: number;
}>();

export default function SubPartnersTable({ tableData }: SubPartnersTableProps) {
  const columns = [
    columnHelper.accessor(
      (row) => `${row.firstName ?? ""} ${row.lastName ?? ""}`,
      {
        id: "name",
        header: "Nome e Cognome",
        cell: (info) => info.getValue(),
      }
    ),
    columnHelper.accessor("provincia", {
      id: "provincia",
      header: "Provincia",
      cell: (info) => info.row.original.provincia || "-",
    }),
    columnHelper.accessor("email", {
      id: "email",
      header: "E-mail",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("totalCommission", {
      id: "totalCommission",
      header: () => "Commissioni Dovute",
      cell: (info) => `€ ${(info.getValue() as number).toFixed(2)}`,
    }),
  ];

  const [data] = useState(() => [...tableData]);

  return <GenericTable data={data} columns={columns} title="Agenti" />;
}

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
import Menu from './SubPartnersTableMenu';
import GenericTable from "@/app/components/GenericTable";

type SubPartnersTableProps = {
  tableData: {
    firstName: string | null;
    lastName: string | null;
    provincia: string | null;
    email: string | null;
  }[];
};

const columnHelper = createColumnHelper<{
  firstName: string | null;
  lastName: string | null;
  provincia: string | null;
  email: string | null;
}>();

export default function SubPartnersTable({ tableData }: SubPartnersTableProps) {
  // const [sorting, setSorting] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  // const handleDelete = async () => {
  //   if (!selectedUserId) return;
  //   try {
  //     return true;
  //   } catch (error) {
  //     console.error("Error deleting user:", error);
  //   } finally {
  //     setSelectedUserId(null);
  //     onClose();
  //     window.location.reload();
  //   }
  // };

  const columns = [
    columnHelper.accessor((row) => `${row.firstName ?? ""} ${row.lastName ?? ""}`, {
      id: "name",
      header: 'Nome e Cognome',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("provincia", {
      id: "provincia",
      header: "Provincia",
      cell: (info) => (info.row.original.provincia || "-"),
    }),
    columnHelper.accessor("email", {
      id: "email",
      header: () => 'E-mail',
      cell: (info) => info.getValue()
    }),
  ]

  const onRowClick = (row: Record<string, any>) => {
    router.push(`/agents/partners/${row.email}`);
  };

  return (
    <GenericTable
      columns={columns}
      data={tableData}
      onRowClick={onRowClick}
      title="Agenti"
      itemsPerPage={10}
    />
  );
}

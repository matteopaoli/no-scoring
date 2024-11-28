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

type UsersTableProps = {
  tableData: unknown[];
};

const columnHelper = createColumnHelper();

export default function UsersTable({ tableData }: UsersTableProps) {
  const [sorting, setSorting] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const handleDelete = async () => {
    if (!selectedUserId) return;
    try {
      const response = await fetch(`/api/users/${selectedUserId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("User deleted successfully");
      } else {
        console.error("Failed to delete the user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setSelectedUserId(null);
      onClose();
      window.location.reload();
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "refName",
        header: "Nome Referente",
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
              <Link href={`/admin/users/edit/${info.getValue()}`}>
                <Icon
                  as={MdOutlineEdit}
                  width="20px"
                  height="20px"
                  color="inherit"
                  cursor="pointer"
                />
              </Link>
            </Tooltip>

            <Tooltip label="Elimina Utente" hasArrow placement="auto">
              <span>
                <Icon
                  as={MdDeleteOutline}
                  width="20px"
                  height="20px"
                  color="red.500"
                  cursor="pointer"
                  onClick={() => {
                    setSelectedUserId(info.getValue());
                    onOpen();
                  }}
                />
              </span>
            </Tooltip>
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
        itemsPerPage={10}
        menu={Menu}
      />

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Conferma Eliminazione</ModalHeader>
          <ModalBody>Sei sicuro di voler eliminare questo utente?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Annulla
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Elimina
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

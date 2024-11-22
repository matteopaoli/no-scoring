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
      columnHelper.accessor("refName", {
        id: "refName",
        header: () => (
          <Text fontSize={{ sm: "10px", lg: "12px" }} color="gray.400">
            Nome Referente
          </Text>
        ),
        cell: (info) => (
          <Flex align="center">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              {info.getValue()}
            </Text>
          </Flex>
        ),
      }),
      columnHelper.accessor("partnerName", {
        id: "partnerName",
        header: () => (
          <Text fontSize={{ sm: "10px", lg: "12px" }} color="gray.400">
            Partner
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {(info.getValue() as string).trim() ? info.getValue() : "—"}
          </Text>
        ),
      }),
      columnHelper.accessor("totalCommission", {
        id: "totalCommission",
        header: () => (
          <Text fontSize={{ sm: "10px", lg: "12px" }} color="gray.400">
            Commssioni guadagnate
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {Number(info.getValue()).toFixed(2)} €
          </Text>
        ),
      }),
      columnHelper.accessor("totalCommissionCurrentMonth", {
        id: "totalCommissionCurrentMonth",
        header: () => (
          <Text fontSize={{ sm: "10px", lg: "12px" }} color="gray.400">
            Commssioni guadagnate (mese corrente)
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {Number(info.getValue()).toFixed(2)} €
          </Text>
        ),
      }),
      columnHelper.accessor("totalVolume", {
        id: "totalVolume",
        header: () => (
          <Text fontSize={{ sm: "10px", lg: "12px" }} color="gray.400">
            Volume totale
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {Number(info.getValue()).toFixed(2)} €
          </Text>
        ),
      }),
      columnHelper.accessor("totalVolumeCurrentMonth", {
        id: "totalVolumeCurrentMonth",
        header: () => (
          <Text fontSize={{ sm: "10px", lg: "12px" }} color="gray.400">
            Volume (mese corrente)
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {Number(info.getValue()).toFixed(2)} €
          </Text>
        ),
      }),
      columnHelper.accessor("id", {
        id: "id",
        header: () => (
          <Text fontSize={{ sm: "10px", lg: "12px" }} color="gray.400">
            Azioni
          </Text>
        ),
        cell: (info) => (
          <Flex gap="8px" alignItems="center">
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
          
            {info.row.original.status === "pending" && (
                <Tooltip label="Copia link onboarding" hasArrow placement="auto">
                  <span>
                  <CopyButton text={info.row.original.onboardingLink} />
                  </span>
                </Tooltip>
            )}
          </Flex>
        ),
      }),
    ],
    [textColor, onOpen]
  );

  const [data] = useState(() => [...tableData]);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Lista Utenti
        </Text>
        <Menu />
      </Flex>
      <Box overflowX="scroll">
        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    colSpan={header.colSpan}
                    pe="10px"
                    borderColor={borderColor}
                  >
                    <Flex align="center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table
              .getRowModel()
              .rows.slice(0, 11)
              .map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td
                      key={cell.id}
                      fontSize={{ sm: "14px" }}
                      minW={{ sm: "150px", md: "200px" }}
                      borderColor="transparent"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>

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
    </Card>
  );
}

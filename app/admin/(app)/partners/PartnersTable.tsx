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
  useReactTable,
} from "@tanstack/react-table";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import Card from "@/app/components/card/Card";
import Menu from "./PartnersTableMenu";
import { useMemo, useState } from "react";
import { User } from "@/app/db";
import { Link } from "@chakra-ui/next-js";

type PartnersTableProps = {
  tableData: Omit<User, "password" | "role" | "businessTypeId">[];
};

const columnHelper = createColumnHelper();

export default function PartnersTable({ tableData }: PartnersTableProps) {
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
        // Handle successful deletion (e.g., refetch data or update state)
        console.log("User deleted successfully");
      } else {
        console.error("Failed to delete the user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setSelectedUserId(null);
      onClose();
      window.location.reload()
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        id: "name",
        header: () => (
          <Text fontSize={{ sm: "10px", lg: "12px" }} color="gray.400">
            Nome
          </Text>
        ),
        cell: (info) => (
          <Flex align="center">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              {`${info.row.original.firstName} ${info.row.original.lastName}`} 
            </Text>
          </Flex>
        ),
      }),
      columnHelper.accessor("email", {
        id: "email",
        header: () => (
          <Text fontSize={{ sm: "10px", lg: "12px" }} color="gray.400">
            E-mail
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
      columnHelper.accessor("id", {
        id: "id",
        header: () => (
          <Text fontSize={{ sm: "10px", lg: "12px" }} color="gray.400">
            Azioni
          </Text>
        ),
        cell: (info) => (
          <Flex gap="8px">
            <Link href={`/admin/partners/edit/${info.getValue()}`}>
              <Icon as={MdOutlineEdit} width="20px" height="20px" color="inherit" />
            </Link>
            {/* <Icon
              as={MdDeleteOutline}
              width="20px"
              height="20px"
              color="red.500"
              cursor="pointer"
              onClick={() => {
                setSelectedUserId(info.getValue());
                onOpen();
              }}
            /> */}
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
    <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
          Lista Partner
        </Text>
        <Menu />
      </Flex>
      <Box>
        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id} colSpan={header.colSpan} pe="10px" borderColor={borderColor}>
                    <Flex align="center">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.slice(0, 11).map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id} fontSize={{ sm: "14px" }} minW={{ sm: "150px", md: "200px" }} borderColor="transparent">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
          <ModalBody>
            Sei sicuro di voler eliminare questo partner?
          </ModalBody>
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

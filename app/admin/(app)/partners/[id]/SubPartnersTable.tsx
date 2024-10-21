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
  const [sorting, setSorting] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const handleDelete = async () => {
    if (!selectedUserId) return;
    try {
      return true;
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
      columnHelper.accessor((row) => `${row.firstName ?? ""} ${row.lastName ?? ""}`, {
        id: "name",
        header: () => (
          <Text fontSize={{ sm: "10px", lg: "12px" }} color="gray.400">
            Nome e Cognome
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor("provincia", {
        id: "provincia",
        header: () => (
          <Text fontSize={{ sm: "10px", lg: "12px" }} color="gray.400">
            Provincia
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.row.original.provincia || "-"}
          </Text>
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
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        ),
      }),
    ],
    [textColor]
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

  const onRowClick = (row: Row<{ firstName: string | null; lastName: string | null; provincia: string | null; email: string | null }>) => {
    router.push(`/admin/partners/${row.original.email}`);
  };

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
      mt="20px"
    >
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Lista Sub-Partner
        </Text>
      </Flex>
      <Box>
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
                <Tr
                  key={row.id}
                  onClick={() => onRowClick(row)}
                  style={{
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  _hover={{ backgroundColor: "gray.100" }} // Add hover effect
                >
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
          <ModalBody>Sei sicuro di voler eliminare questo partner?</ModalBody>
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

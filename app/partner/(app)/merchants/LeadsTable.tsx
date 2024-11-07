"use client";

import ReferLeadForm from "@/app/components/forms/ReferLeadForm";
import GenericTable from "@/app/components/GenericTable";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  useColorModeValue,
  Flex,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface Lead {
  id: string;
  email: string | null;
  firstName: string;
  lastName: string;
  createdAt: Date | null;
}

interface LeadsTableProps {
  leads: Lead[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const leadColumns: ColumnDef<Lead>[] = [
    {
      accessorKey: "Name",
      header: "Nome",
      cell: (info) =>
        `${info.row.original.firstName} ${info.row.original.lastName}`,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "createdAt",
      header: "Data creazione",
      cell: (info) =>
        new Date(info.getValue() as Date).toLocaleDateString("it-IT"),
    },
  ];

  return (
    <>
      <Flex justifyContent="end">
        <Button
          onClick={onOpen}
          my={10}
          maxWidth={300}
          colorScheme="brand"
          variant="outline"
        >
          Segnala un nuovo contatto
        </Button>
      </Flex>
      <ReferLeadForm isOpen={isOpen} onClose={onClose} />
      <GenericTable
        data={leads}
        columns={leadColumns}
        title="Contatti inviati"
        itemsPerPage={10} // Customize the number of items per page if needed
      />
    </>
  );
}

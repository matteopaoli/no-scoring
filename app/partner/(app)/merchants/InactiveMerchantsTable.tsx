"use client";

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
} from "@chakra-ui/react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface InactiveMerchant {
  id: string;
  email: string | null;
  createdAt: Date | null;
}

interface InactiveMerchantsTableProps {
  merchants: InactiveMerchant[];
}

export function InactiveMerchantsTable({
  merchants,
}: InactiveMerchantsTableProps) {
  const merchantColumns: ColumnDef<InactiveMerchant>[] = [
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
    <GenericTable
      data={merchants}
      columns={merchantColumns}
      title="Commercianti inattivi"
      itemsPerPage={10} // Customize the number of items per page if needed
    />
  );
}

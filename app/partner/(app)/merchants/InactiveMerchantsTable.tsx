"use client";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  useColorModeValue
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
      cell: (info) => info.getValue() || "No Email",
    },
    {
      accessorKey: "createdAt",
      header: "Data creazione",
      cell: (info) =>
        info.getValue()
          ? new Date(info.getValue() as Date).toLocaleDateString('it-IT')
          : "N/A",
    },
  ];

  const table = useReactTable({
    data: merchants,
    columns: merchantColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  let mainText = useColorModeValue('navy.700', 'white');

  return (
    <>
      <Heading as="h3" size="lg" color={mainText} py="20px" pl={{ md: '20px'}}>
        Commercianti inattivi
      </Heading>
      <TableContainer>
        <Table variant="striped">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

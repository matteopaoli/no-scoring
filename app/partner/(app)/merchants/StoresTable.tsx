"use client";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Text,
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

interface Store {
  storeId: string;
  storeName: string;
  storeImage: string | null;
  createdAt: Date | null;
  totalCommission: number;
}

interface StoresTableProps {
  stores: Store[];
}

export default function StoresTable({ stores }: StoresTableProps) {
  let mainText = useColorModeValue('navy.700', 'white');

  const storeColumns: ColumnDef<Store>[] = [
    {
      accessorKey: "storeName",
      header: () => <Text fontSize="md" fontWeight="bold">Name</Text>,
      cell: (info) => (
        <Text fontSize="md" color={mainText}>
          {info.getValue()}
        </Text>
      ),
    },
    {
      accessorKey: "totalCommission",
      header: () => <Text fontSize="md" fontWeight="bold">Commissione</Text>,
      cell: (info) => (
        <Text fontSize="md" color={mainText}>
          € {Number(info.getValue()).toFixed(2)}
        </Text>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => <Text fontSize="md" fontWeight="bold">Data Creazione</Text>,
      cell: (info) => (
        <Text fontSize="md" color={mainText}>
          {new Date(info.getValue() as string).toLocaleDateString('it-IT')}
        </Text>
      ),
    },
  ];

  const table = useReactTable({
    data: stores,
    columns: storeColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Heading as="h3" size="lg" color={mainText} py="20px" pl={{ md: '20px'}}>
        Negozi
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

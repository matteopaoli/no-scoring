"use client";
import {
  Box,
  Button,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorModeValue,
  Card,
  Heading,
  useMediaQuery,
} from "@chakra-ui/react";
import { useSize } from '@chakra-ui/react-use-size'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";

interface GenericTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  itemsPerPage?: number;
  title: string;
  onRowClick?: (rowData: T) => void; // Row click handler,
  hideColumnsResponsive?: string[]
  menu?: (props: any) => JSX.Element;
}

export default function GenericTable<T>({
  data,
  columns,
  itemsPerPage = 10,
  title,
  onRowClick,
  hideColumnsResponsive,
  menu: Menu,
}: GenericTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const boxRef = useRef(null)
  const dimensions = useSize(boxRef)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const table = useReactTable({
    state: {
      columnVisibility
    },
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  });

  useEffect(() => {
    if (hideColumnsResponsive) {
      if (dimensions?.width && dimensions.width > 500) {
        setColumnVisibility(Object.fromEntries(hideColumnsResponsive.map((c: string)=> [c, true])));
      }
      else setColumnVisibility(Object.fromEntries(hideColumnsResponsive.map((c: string)=> [c, false])));
    }
    else {
    }
  }, [dimensions?.width ]);

  const paginatedRows = table
    .getRowModel()
    .rows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const headingColor = useColorModeValue("navy.700", "white");

  // Handle row click
  const handleRowClick = (rowData: T) => {
    if (onRowClick) {
      onRowClick(rowData);
    }
  };

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
      ref={boxRef}
    >
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Heading
          as="h4"
          size="md"
          fontWeight="bold"
          my={4}
          color={headingColor}
        >
          {title}
        </Heading>
        {Menu ? <Menu /> : null}
      </Flex>
      <Table variant="simple" color="gray.500">
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id} borderColor={borderColor}>
                  <Text
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color="gray.400"
                    fontWeight="bold"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Text>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {paginatedRows.map((row) => (
            <Tr
              key={row.id}
              onClick={() => handleRowClick(row.original)} // Handle row click
              _hover={{ bg: "gray.100", cursor: "pointer" }} // Hover effect
            >
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id} borderColor="transparent">
                  <Flex align="center">
                    {cell.column.columnDef.accessorKey === "actions" ? (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    ) : (
                      <Text fontSize="sm" fontWeight="bold" color={textColor}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Text>
                    )}
                  </Flex>
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Pagination Controls */}
      <Flex justify="space-between" align="center" my={4}>
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          isDisabled={currentPage === 1}
        >
          Precedente
        </Button>
        <Text>
          Pagina {currentPage} di {totalPages}
        </Text>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          isDisabled={currentPage === totalPages}
        >
          Successivo
        </Button>
      </Flex>
    </Card>
  );
}

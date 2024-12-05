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
  Select,
} from "@chakra-ui/react";
import { useSize } from "@chakra-ui/react-use-size";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  VisibilityState,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

interface GenericTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  itemsPerPage?: number;
  title: string;
  onRowClick?: (rowData: T) => void; // Row click handler
  hideColumnsResponsive?: string[];
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
  const [itemsPerPageState, setItemsPerPageState] = useState(itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPageState);
  const boxRef = useRef(null);
  const dimensions = useSize(boxRef);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    state: {
      columnVisibility,
      sorting,
    },
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
  });

  useEffect(() => {
    if (hideColumnsResponsive) {
      if (dimensions?.width && dimensions.width > 500) {
        setColumnVisibility(
          Object.fromEntries(
            hideColumnsResponsive.map((c: string) => [c, true])
          )
        );
      } else
        setColumnVisibility(
          Object.fromEntries(
            hideColumnsResponsive.map((c: string) => [c, false])
          )
        );
    }
  }, [dimensions?.width]);

  const paginatedRows = table
    .getRowModel()
    .rows.slice(
      (currentPage - 1) * itemsPerPageState,
      currentPage * itemsPerPageState
    );

  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const headingColor = useColorModeValue("navy.700", "white");

  // Handle row click
  const handleRowClick = (rowData: T) => {
    if (onRowClick) {
      onRowClick(rowData);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newItemsPerPage = parseInt(event.target.value, 10);
    setItemsPerPageState(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const getSortIcon = (header: any) => {
    if (header.column.columnDef.accessorKey === "actions") {
      return null;
    }
  
    if (header.column.getIsSorted()) {
      return header.column.getIsSorted() === "asc" ? (
        <FaSortUp color="gray.400" />
      ) : (
        <FaSortDown color="gray.400" />
      );
    }
  
    return <FaSort color="gray.400" />;
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
        <Flex justify="flex-end" align="center" my={4} gap="10px">
          <Text mr={2}>Mostra</Text>
          <Select
            value={itemsPerPageState.toString()}
            onChange={handleItemsPerPageChange}
            width="auto"
            maxWidth="150px"
          >
            <option value="10">10 per pagina</option>
            <option value="20">20 per pagina</option>
            <option value="100">100 per pagina</option>
          </Select>
          {Menu ? <Menu /> : null}
        </Flex>
      </Flex>
      <Table variant="simple" color="gray.500">
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th
                  key={header.id}
                  borderColor={borderColor}
                  onClick={header.column.getToggleSortingHandler()}
                  _hover={{ cursor: "pointer" }}
                >
                  <Text
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color="gray.400"
                    fontWeight="bold"
                    display="flex"
                    alignItems="center"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {getSortIcon(header)}
                  </Text>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {paginatedRows.length ? (
            paginatedRows.map((row) => (
              <Tr
                key={row.id}
                onClick={() => handleRowClick(row.original)} // Handle row click
                _hover={{ bg: "gray.100", cursor: "pointer" }} // Hover effect
              >
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id} borderColor="transparent">
                    <Flex align="center">
                      {cell.column.columnDef.accessorKey === "actions" ? (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
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
            ))
          ) : (
            <Tr>
              <Td colSpan={columns.length} textAlign="center" py={4}>
                <Text fontSize="md" color={textColor}>
                  Questa tabella è vuota
                </Text>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      {paginatedRows.length ? (
        <Flex justify="space-between" align="center" my={4}>
          <Button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            isDisabled={currentPage === 1}
          >
            Precedente
          </Button>
          <Text>
            Pagina {currentPage} di {totalPages}
          </Text>
          <Button
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
            isDisabled={currentPage === totalPages}
          >
            Successivo
          </Button>
        </Flex>
      ) : null}
    </Card>
  );
}

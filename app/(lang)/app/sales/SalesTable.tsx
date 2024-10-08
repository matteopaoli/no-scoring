"use client";
/* eslint-disable */

import {
  Box,
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { MdCheckCircle, MdError, MdPending } from "react-icons/md";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Card from "@/app/components/card/Card";
import { useEffect, useMemo, useState } from "react";
import type Stripe from "stripe";

type ChargesTableProps = {
  chargesData: (Stripe.Charge & { productNames: string[] })[]
};

const columnHelper = createColumnHelper<Stripe.Charge>();

export default function ChargesTable({ chargesData }: ChargesTableProps) {
  const CHARGES_PER_PAGE = 10; // Define charges per page
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    images: false,
  });
  const [isMdViewport] = useMediaQuery("(min-width: 768px)");
  const totalCharges = chargesData.length;
  const totalPages = Math.ceil(totalCharges / CHARGES_PER_PAGE); // Calculate total pages

  useEffect(() => {
    setColumnVisibility({ description: isMdViewport });
  }, [isMdViewport]);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const statusTranslation: Record<string, string> = {
    succeeded: "Completato",
    failed: "Fallito",
    pending: "In attesa",
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID Transazione",
        cell: info => (
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("amount", {
        header: "Importo",
        cell: info => {
          const amount = info.getValue();
          const currency = info.row.original.currency.toUpperCase();
          const formattedAmount = (amount / 100).toFixed(2);
          return (
            <Text color={textColor} fontSize="sm" fontWeight="700">
              {formattedAmount} {currency}
            </Text>
          );
        },
        enableSorting: true,
      }),
      columnHelper.accessor("created", {
        header: "Data Creazione",
        cell: info => {
          const timestamp = info.getValue();
          const date = new Date(timestamp * 1000).toLocaleDateString();
          return (
            <Text color={textColor} fontSize="sm" fontWeight="700">
              {date}
            </Text>
          );
        },
        enableSorting: true,
      }),
      columnHelper.accessor("status", {
        header: "Stato",
        cell: info => {
          const status = info.getValue();
          let statusIcon;

          switch (status) {
            case "succeeded":
              statusIcon = <MdCheckCircle color="green.500" />;
              break;
            case "failed":
              statusIcon = <MdError color="red.500" />;
              break;
            case "pending":
              statusIcon = <MdPending color="yellow.500" />;
              break;
            default:
              statusIcon = <MdError color="gray.500" />;
          }

          return (
            <Flex align="center">
              {statusIcon}
              <Text ml={2} color={textColor} fontSize="sm" fontWeight="700">
                {statusTranslation[status] || status}
              </Text>
            </Flex>
          );
        },
        enableSorting: true,
      }),
      columnHelper.accessor("billing_details.name", {
        header: "Nome Cliente",
        cell: info => (
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue() || "N/A"}
          </Text>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("billing_details.email", {
        header: "Email Cliente",
        cell: info => (
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue() || "N/A"}
          </Text>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("productNames", {
        header: "Nome Prodotto",
        cell: info => (
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue().join(", ") || "N/A"}
          </Text>
        ),
        enableSorting: false,
      }),
    ],
    [textColor]
  );

  const table = useReactTable({
    data: chargesData,
    columns,
    state: {
      sorting,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Paginated rows based on the current page and per-page count
  const paginatedRows = table.getRowModel().rows.slice(
    (currentPage - 1) * CHARGES_PER_PAGE,
    currentPage * CHARGES_PER_PAGE
  );

  // Pagination handler functions
  const goToPreviousPage = () => setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  const goToNextPage = () => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));

  return (
    <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
          Lista Transazioni
        </Text>
      </Flex>
      <Box>
        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
          <Thead>
            {table.getHeaderGroups().map(headerGroup => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Th key={header.id} colSpan={header.colSpan}>
                    {!header.isPlaceholder && (
                      <Flex
                        justifyContent="space-between"
                        align="center"
                        onClick={header.column.getToggleSortingHandler()}
                        cursor={header.column.getCanSort() ? "pointer" : "default"}
                      >
                        <Text fontSize={{ sm: "10px", lg: "12px" }} color="gray.400">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </Text>
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === "asc" ? (
                            <FaSortUp color="gray.400" />
                          ) : (
                            <FaSortDown color="gray.400" />
                          )
                        ) : (
                          <FaSort color="gray.400" />
                        )}
                      </Flex>
                    )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map(row => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <Td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  ))}
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={columns.length} textAlign="center">
                  <Text color="gray.400">Nessuna transazione trovata</Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>

        {/* Pagination Controls */}
        <Flex justifyContent="space-between" alignItems="center" mt={4} px={5}>
          <Button
            onClick={goToPreviousPage}
            isDisabled={currentPage === 1}
            size="sm"
            variant="outline"
            colorScheme="brand.500"
          >
            Precedente
          </Button>
          <Text fontSize="sm">
            Pagina {currentPage} di {totalPages}
          </Text>
          <Button
            onClick={goToNextPage}
            isDisabled={currentPage === totalPages}
            size="sm"
            variant="outline"
            colorScheme="brand.500"
          >
            Successiva
          </Button>
        </Flex>
      </Box>
    </Card>
  );
}

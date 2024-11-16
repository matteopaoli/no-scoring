'use client'

import { Box, Flex, Icon, Image, Portal, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, useMediaQuery, Button } from "@chakra-ui/react";
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, Row, useReactTable, VisibilityState } from "@tanstack/react-table";
import { MdArrowForward } from "react-icons/md";
// Custom components
import Card from "@/app/components/card/Card";
import Menu from "./ProductsTableMenu";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@chakra-ui/next-js";
import type Stripe from "stripe";
import ProductSidebar from "./ProductSidebar";
import CreateItemButton from "@/app/components/CreateItemButton";
import styles from './Table.module.css'


// Default image URL
const DEFAULT_IMAGE_URL = "/img/product-placeholder.png"

type ProductsTableProps = {
  tableData: Stripe.Product[]
};

const columnHelper = createColumnHelper<Stripe.Product>();

export default function ProductsTable({ tableData }: ProductsTableProps) {
  const PRODUCTS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    images: false
  });
  const [isMdViewport] = useMediaQuery('(min-width: 768px)');
  const totalProducts = tableData.length; // Track the total number of products
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE); // Calculate total pages

  useEffect(() => {
    if (isMdViewport) {
      setColumnVisibility({
        description: true
      });
    } else {
      setColumnVisibility({
        description: false
      });
    }
  }, [isMdViewport]);

  console.log(tableData)

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const columns = useMemo(
    () => [
      columnHelper.accessor("images", {
        id: "image",
        header: () => (
          <Text justifyContent="space-between" align="center" fontSize={{ sm: "10px", lg: "12px" }} color="gray.400">
            Immagine
          </Text>
        ),
        cell: (info) => {
          const images = info.getValue() as string[];
          const imageUrl = images.length > 0 ? images[0] : DEFAULT_IMAGE_URL;

          return (
            <Image src={imageUrl} alt="Product Image" boxSize="50px" borderRadius="md" fallbackSrc={DEFAULT_IMAGE_URL} />
          );
        },
      }),
      columnHelper.accessor("name", {
        id: "name",
        header: () => (
          <Text justifyContent="space-between" align="center" fontSize={{ sm: "10px", lg: "12px" }} color="gray.400">
            Nome Prodotto
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
      columnHelper.accessor("active", {
        id: "details",
        header: () => (
          <Text justifyContent="space-between" align="center" fontSize={{ sm: "10px", lg: "12px" }} color="gray.400">
            Dettagli
          </Text>
        ),
        cell: (info) => (
          <Flex alignItems="center" >
            <Icon as={MdArrowForward} color="navy.700" width="24px" className={styles.icon} me="16px" />
            <Text color={textColor} textDecoration="underline" fontSize="sm" fontWeight="700">
              Dettagli prodotto
            </Text>
          </Flex>
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
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const onRowClick = (row: Row<Stripe.Product>) => {
    setIsSidebarOpen(true);
    setActiveProductId(row.original.id);
  };

  const paginatedRows = table.getRowModel().rows.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

  return (
    <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
          Lista Prodotti
        </Text>
        <CreateItemButton href="/app/products/new">Crea nuovo prodotto</CreateItemButton>
      </Flex>
      <Box>
        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th
                      key={header.id}
                      colSpan={header.colSpan}
                      pe="10px"
                      borderColor={borderColor}
                      cursor="pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <Flex justifyContent="space-between" align="center" fontSize={{ sm: "10px", lg: "12px" }} color="gray.400">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: "",
                          desc: "",
                        }[header.column.getIsSorted()] ?? null}
                      </Flex>
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {paginatedRows.map((row) => {
              return (
                <Tr
                  key={row.id}
                  onClick={() => onRowClick(row)}
                  style={{ cursor: "pointer", transition: "background-color 0.2s" }}
                  _hover={{ backgroundColor: 'gray.100' }} // Add hover effect
                  className={styles.row}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Td
                        key={cell.id}
                        fontSize={{ sm: "14px" }}
                        minW={{ sm: "100px", md: "200px", lg: "auto" }}
                        borderColor="transparent"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination Controls */}
      <Flex justify="space-between" align="center" px="25px" mb="8px">
        <Button onClick={() => setCurrentPage(currentPage - 1)} isDisabled={currentPage === 1}>
          Precedente
        </Button>
        <Text>
          Pagina {currentPage} di {totalPages}
        </Text>
        <Button onClick={() => setCurrentPage(currentPage + 1)} isDisabled={currentPage === totalPages}>
          Successivo
        </Button>
      </Flex>

      <Portal>
        <ProductSidebar onClose={() => setIsSidebarOpen(false)} isOpen={isSidebarOpen} productId={activeProductId} />
      </Portal>
    </Card>
  );
}

  "use client";
  /* eslint-disable */

  import {
    Box,
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
    useMediaQuery,
    Button,
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
  import { MdOutlineEdit, MdCheckCircle, MdError, MdPending } from "react-icons/md";
  // Custom components
  import Card from "@/app/components/card/Card";
  import { useEffect, useMemo, useState } from "react";
  import type Stripe from "stripe";

  type ChargesTableProps = {
    chargesData: Stripe.Charge[];
  };

  const columnHelper = createColumnHelper<Stripe.Charge>();

  export default function ChargesTable({ chargesData }: ChargesTableProps) {
    const CHARGES_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [sorting, setSorting] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
      images: false,
    });
    const [isMdViewport] = useMediaQuery("(min-width: 768px)");
    const totalCharges = chargesData.length;
    const totalPages = Math.ceil(totalCharges / CHARGES_PER_PAGE);

    useEffect(() => {
      if (isMdViewport) {
        setColumnVisibility({
          description: true,
        });
      } else {
        setColumnVisibility({
          description: false,
        });
      }
    }, [isMdViewport]);

    const textColor = useColorModeValue("secondaryGray.900", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

    const columns = useMemo(
      () => [
        columnHelper.accessor("id", {
          id: "id",
          header: () => (
            <Text
              justifyContent="space-between"
              align="center"
              fontSize={{ sm: "10px", lg: "12px" }}
              color="gray.400"
            >
              ID Transazione
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
        columnHelper.accessor("amount", {
          id: "amount",
          header: () => (
            <Text
              justifyContent="space-between"
              align="center"
              fontSize={{ sm: "10px", lg: "12px" }}
              color="gray.400"
            >
              Importo
            </Text>
          ),
          cell: (info) => {
            const amount = info.getValue();
            const currency = info.row.original.currency.toUpperCase();
            const formattedAmount = (amount / 100).toFixed(2);
            return (
              <Text color={textColor} fontSize="sm" fontWeight="700">
                {formattedAmount} {currency}
              </Text>
            );
          },
        }),
        columnHelper.accessor("created", {
          id: "created",
          header: () => (
            <Text
              justifyContent="space-between"
              align="center"
              fontSize={{ sm: "10px", lg: "12px" }}
              color="gray.400"
            >
              Data Creazione
            </Text>
          ),
          cell: (info) => {
            const timestamp = info.getValue();
            const date = new Date(timestamp * 1000).toLocaleDateString();
            return (
              <Text color={textColor} fontSize="sm" fontWeight="700">
                {date}
              </Text>
            );
          },
        }),
        columnHelper.accessor("status", {
          id: "status",
          header: () => (
            <Text
              justifyContent="space-between"
              align="center"
              fontSize={{ sm: "10px", lg: "12px" }}
              color="gray.400"
            >
              Stato
            </Text>
          ),
          cell: (info) => {
            const status = info.getValue();
            let statusIcon;

            switch (status) {
              case "succeeded":
                statusIcon = <Icon as={MdCheckCircle} color="green.500" />;
                break;
              case "failed":
                statusIcon = <Icon as={MdError} color="red.500" />;
                break;
              case "pending":
                statusIcon = <Icon as={MdPending} color="yellow.500" />;
                break;
              default:
                statusIcon = <Icon as={MdError} color="gray.500" />;
            }

            return (
              <Flex align="center">
                {statusIcon}
                <Text ml={2} color={textColor} fontSize="sm" fontWeight="700">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </Flex>
            );
          },
        }),
        columnHelper.accessor("payment_method_details.card.last4", {
          id: "payment_method",
          header: () => (
            <Text
              justifyContent="space-between"
              align="center"
              fontSize={{ sm: "10px", lg: "12px" }}
              color="gray.400"
            >
              Metodo di Pagamento
            </Text>
          ),
          cell: (info) => {
            const last4 = info.getValue();
            return (
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Carta **** **** **** {last4}
              </Text>
            );
          },
        }),
      ],
      [textColor]
    );

    const [data] = useState(() => [...chargesData]);
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

    const paginatedRows = table
      .getRowModel()
      .rows.slice((currentPage - 1) * CHARGES_PER_PAGE, currentPage * CHARGES_PER_PAGE);

    return (
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Lista Transazioni
          </Text>
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
                        <Flex
                          justifyContent="space-between"
                          align="center"
                          fontSize={{ sm: "10px", lg: "12px" }}
                          color="gray.400"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
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
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <Td
                          key={cell.id}
                          fontSize={{ sm: "14px" }}
                          minW={{ sm: "150px", md: "200px", lg: "auto" }}
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
          <Flex justifyContent="space-between" px="25px">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Precedente
            </Button>
            <Text color={textColor}>
              {currentPage} of {totalPages}
            </Text>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Successivo
            </Button>
          </Flex>
        </Box>
      </Card>
    );
  }

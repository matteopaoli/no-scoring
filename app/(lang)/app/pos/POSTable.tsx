"use client";

import {
  Box,
  Flex,
  Icon,
  Image,
  Portal,
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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  FormControl,
  Input,
  Tooltip,
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
import { MdAddCircleOutline, MdArrowForward, MdEmail } from "react-icons/md";
// Custom components
import Card from "@/app/components/card/Card";
import Menu from "./ProductsTableMenu";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@chakra-ui/next-js";
import type Stripe from "stripe";
import ProductSidebar from "./ProductSidebar";
import CreateItemButton from "@/app/components/CreateItemButton";
import styles from "./Table.module.css";
import createPosAction from "./createPos.action";
import InputField from "@/app/components/fields/InputField";
import getFormErrors from "@/app/utils/getFormErrors";
import { useFormState } from "react-dom";
import SubmitButton from "@/app/components/SubmitButton";
import CopyButton from "@/app/components/CopyButton";
import GenericTable from "@/app/components/GenericTable";

// Default image URL
const DEFAULT_IMAGE_URL = "/img/product-placeholder.png";

type ProductsTableProps = {
  tableData: {
    email: string;
    name: string | null;
  }[];
};

const columnHelper = createColumnHelper<Stripe.Product>();

export default function ProductsTable({ tableData }: ProductsTableProps) {
  const [createPosState, createPos] = useFormState(createPosAction, {});

  const textColor = useColorModeValue("secondaryGray.900", "white");

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Nome",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "actions",
        header: "Azioni",
        cell: (info) => (
          <Flex gap="8px" alignItems="center">
            {info.row.original.status === "pending" ? (
              <Tooltip label="Copia link onboarding" hasArrow placement="auto">
                <span>
                  <CopyButton text={info.row.original.onboardingLink} />
                </span>
              </Tooltip>
            ) : (
              <Text>N/A</Text>
            )}
          </Flex>
        ),
      },
    ],
    [textColor]
  );

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Popover>
        <PopoverTrigger>
          <Box p={4}>
            <Button
              leftIcon={<MdAddCircleOutline />}
              variant="solid"
              colorScheme="brand"
              maxW={300}
            >
              Aggiungi nuovo POS
            </Button>
          </Box>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Crea un nuovo Pos</PopoverHeader>
          <PopoverBody>
            <form action={createPos}>
              <InputField
                id="posName"
                name="posName"
                label="Nome POS"
                placeholder=""
                type="text"
                errors={getFormErrors(createPosState.errors, "posName")}
              />
              {createPosState.data ? (
                <Box
                  textAlign="center"
                  p={4}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                >
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color="green.600"
                    mb={4}
                  >
                    Il POS è stato creato correttamente!
                  </Text>
                  <Text mb={4}>
                    Il seguente link è valido una sola volta entro 24 ore.
                    Visitandolo, verrai automaticamente autenticato come il
                    profilo POS appena generato, e il link verrà invalidato.
                  </Text>
                  <Box mb={4}>
                    <CopyButton text={createPosState.data} />
                    <Button>Genera nuovo</Button>
                  </Box>
                  {/* <Box>
                      <InputField
                        id="email-recipient"
                        name="emailRecipient"
                        placeholder="Indirizzo email"
                        errors={sendPosLinkEmailState.errors}
                        label="Email destinatario"
                      />
                      <Button
                        colorScheme="brand"
                        leftIcon={<MdEmail />}
                        variant="outline"
                        size="sm"
                        mt={2}
                        // onClick={() => sendEmail(createPosState.data, email)}
                        // isDisabled={!email || !validateEmail(email)}
                      >
                        Invia email
                      </Button>
                    </Box> */}
                </Box>
              ) : (
                <SubmitButton>Crea POS</SubmitButton>
              )}
            </form>
          </PopoverBody>
          <PopoverFooter></PopoverFooter>
        </PopoverContent>
      </Popover>
      <Box>
        <GenericTable
          data={tableData}
          columns={columns}
          title="Punti Vendita"
          itemsPerPage={10}
          hideColumnsResponsive={["createdAt"]}
        />
      </Box>
    </Card>
  );
}

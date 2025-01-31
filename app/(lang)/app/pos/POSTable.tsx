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
import CreatePosForm from "./createPosForm";
import DeletePOSButton from "./DeletePosButton";

// Default image URL
const DEFAULT_IMAGE_URL = "/img/product-placeholder.png";

type ProductsTableProps = {
  tableData: {
    email: string;
    name: string | null;
    id: string;
  }[];
};

const columnHelper = createColumnHelper<Stripe.Product>();

export default function ProductsTable({ tableData }: ProductsTableProps) {
  const textColor = useColorModeValue("secondaryGray.900", "white");

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Nome",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "email",
        header: 'Email',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "actions",
        header: "Azioni",
        cell: (info) => (
          <Flex gap="8px" alignItems="center">
            <DeletePOSButton posId={info.row.original.id} />
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
      <CreatePosForm />
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

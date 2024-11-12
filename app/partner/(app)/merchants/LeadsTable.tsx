"use client";

import ReferLeadForm from "@/app/components/forms/PartnerCreateMerchantForm";
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
  Flex,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MdCancel, MdCheckCircle, MdHourglassEmpty } from "react-icons/md";

interface Lead {
  id: string;
  email: string | null;
  businessName: string | null;
  firstName: string;
  lastName: string;
  createdAt: Date | null;
}

interface LeadsTableProps {
  leads: Lead[];
}

export function LeadsTable({ leads }: LeadsTableProps) {

  const leadColumns: ColumnDef<Lead>[] = [
    {
      accessorKey: "Name",
      header: "Nome",
      cell: (info) =>
        `${info.row.original.firstName} ${info.row.original.lastName}`,
    },
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
    {
      accessorKey: "status",
      header: "Stato",
      cell: (info) => {
        const status = info.getValue() as string;
  
        const statusMap: Record<string, { label: string; icon: JSX.Element }> = {
          pending: {
            label: "In attesa",
            icon: <MdHourglassEmpty style={{ color: "#FFB547", fontSize: "1.5em" }} />,  // Softer yellow
          },
          accepted: {
            label: "Accettato",
            icon: <MdCheckCircle style={{ color: "green", fontSize: "1.5em" }} />,
          },
          rejected: {
            label: "Rifiutato",
            icon: <MdCancel style={{ color: "red", fontSize: "1.5em" }} />,
          },
        };
  
        const { label, icon } = statusMap[status] || {};
  
        return (
          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {icon}
            {label}
          </span>
        );
      },
    },
  ];
  return (
    <>
      <GenericTable
        data={leads}
        columns={leadColumns}
        title="Contatti inviati"
        itemsPerPage={10} // Customize the number of items per page if needed
        hideColumnsResponsive={['email', 'createdAt']}
      />
    </>
  );
}

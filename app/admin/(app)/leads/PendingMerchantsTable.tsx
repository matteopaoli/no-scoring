"use client";

import CopyButton from "@/app/components/CopyButton";
import GenericTable from "@/app/components/GenericTable";
import {
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  Popover,
  PopoverTrigger,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { MdDelete } from "react-icons/md";
import DeleteLeadButton from "./DeleteLeadButton";

interface Merchant {
  id: string;
  email: string | null;
  createdAt: Date | null;
  onboardingLink: string | null;
}

interface PendingMerchantsTableProps {
  merchants: Merchant[];
}

export default function PendingMerchantsTable({
  merchants,
}: PendingMerchantsTableProps) {
  const merchantColumns: ColumnDef<Merchant>[] = [
    {
      accessorKey: "name",
      header: "Nome referente",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "phoneNumber",
      header: "Telefono",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "provincia",
      header: "Provincia",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "createdAt",
      header: "Data creazione",
      cell: (info) =>
        new Date(info.getValue() as Date).toLocaleDateString("it-IT", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      accessorKey: "referredByName",
      header: "Creato da",
      cell: (info) =>
        (info.getValue() as string).trim() ? info.getValue() : "—",
    },
    {
      accessorKey: "actions",
      header: "",
      cell: (info) => (
        <>
          <Tooltip label="Copia link onboarding" hasArrow placement="auto">
            <span>
              <CopyButton text={info.row.original.onboardingLink} />
            </span>
          </Tooltip>
          <DeleteLeadButton userId={info.row.original.id} />
        </>
      ),
    },
  ];

  return (
    <GenericTable
      data={merchants}
      columns={merchantColumns}
      title="Lead"
      itemsPerPage={10} // Customize the number of items per page if needed
    />
  );
}

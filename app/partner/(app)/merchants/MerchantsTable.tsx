"use client";

import CopyButton from "@/app/components/CopyButton";
import GenericTable from "@/app/components/GenericTable";
import { Flex, Text, Tooltip } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { MdCheckCircle, MdHourglassEmpty } from "react-icons/md";

interface Merchant {
  id: string;
  email: string | null;
  createdAt: Date | null;
  onboardingLink: string;
  status: "active" | "pending";
}

interface MerchantsTableProps {
  merchants: Merchant[];
}

export default function MerchantsTable({ merchants }: MerchantsTableProps) {
  console
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
        new Date(info.getValue() as Date).toLocaleDateString("it-IT", { day: '2-digit', month: '2-digit', year: 'numeric' }),
    },
    {
      accessorKey: "status",
      header: "Stato",
      cell: (info) => {
        const status = info.getValue() as string;
        const statusMap: Record<string, { label: string; icon: JSX.Element }> =
          {
            pending: {
              label: "In Attesa",
              icon: (
                <MdHourglassEmpty
                  style={{ color: "#FFB547", fontSize: "1.5em" }}
                />
              ),
            },
            active: {
              label: "Attivo",
              icon: (
                <MdCheckCircle style={{ color: "green", fontSize: "1.5em" }} />
              ),
            },
          };

        const { label, icon } = statusMap[status] || {};

        return (
          <span
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            {icon}
            {label}
          </span>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Onboarding stripe",
      cell: (info) => (
        <Flex gap="8px" alignItems="center">
          {info.row.original.status === "pending" ? (
            <Tooltip label="Copia link onboarding" hasArrow placement="auto">
              <span>
                <CopyButton text={info.row.original.onboardingLink} />
              </span>
            </Tooltip>
          ): <Text>N/A</Text>}
        </Flex>
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

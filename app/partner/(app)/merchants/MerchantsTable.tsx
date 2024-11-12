"use client";

import GenericTable from "@/app/components/GenericTable";
import { Box } from "@chakra-ui/react";
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
  const merchantColumns: ColumnDef<Merchant>[] = [
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
        const statusMap: Record<string, { label: string; icon: JSX.Element }> =
          {
            pending: {
              label: "In attesa",
              icon: (
                <MdHourglassEmpty
                  style={{ color: "#FFB547", fontSize: "1.5em" }}
                />
              ), // Softer yellow
            },
            active: {
              label: "Accettato",
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
  ];

  return (
    <GenericTable
      data={merchants}
      columns={merchantColumns}
      title="Commercianti"
      itemsPerPage={10} // Customize the number of items per page if needed
    />
  );
}

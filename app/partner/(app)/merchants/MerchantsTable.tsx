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
      accessorKey: "status",
      header: "Stato",
      cell: (info) => {
        const status = info.getValue() as string;

        if (status === "active") {
          return (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#32CD32",
                }}
              ></span>
              Attivo
            </div>
          );
        } else {
          const leadStatus = info.row.original.leadStatus;
          const statusColors: Record<string, string> = {
            to_contact: "#FFA500", // Orange
            awaiting_response: "#FFD700", // Yellow
            appointment_set: "#32CD32", // Green
            to_cancel: "#FF4500", // Red
            history: "#808080", // Gray
          };

          const statusText: Record<string, string> = {
            to_contact: "Da contattare",
            awaiting_response: "In attesa di risposta",
            appointment_set: "Fissato appuntamento",
            to_cancel: "Da annullare",
            history: "Storico",
          };
          const color = statusColors[leadStatus] || "#000000"; // Default to black if not defined
          const text = statusText[leadStatus] || leadStatus;

          return (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: color,
                }}
              ></span>
              {text}
            </div>
          );
        }
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
          ) : (
            <Text>N/A</Text>
          )}
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

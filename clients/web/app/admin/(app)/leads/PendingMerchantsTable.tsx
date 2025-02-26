"use client";

import CopyButton from "@/app/components/CopyButton";
import GenericTable from "@/app/components/GenericTable";
import {
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverTrigger,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import DeleteLeadButton from "./DeleteLeadButton";
import PendingMerchantsFilters from "./PendingMerchantsFilters"; // Import the filters component
import { useEffect, useState } from "react";
import updateLeadStatusAction from "./updateLeadStatus.action";
import { useRouter } from "next/navigation";
import EditableCell from "./EditableCell";
import { MerchantService } from "@/app/services/merchantService";
import updateNotesAction from "./updateNotes.action";

interface Merchant {
  id: string;
  email: string | null;
  createdAt: Date | null;
  onboardingLink: string | null;
  name: string | null;
  phoneNumber: string | null;
  provincia: string | null;
  referredByName: string | null;
  leadStatus: string | null;
}

interface PendingMerchantsTableProps {
  merchants: Merchant[];
}

export default function PendingMerchantsTable({
  merchants,
}: PendingMerchantsTableProps) {
  const [filteredMerchants, setFilteredMerchants] = useState(merchants);
  const [filters, setFilters] = useState({ statuses: [], email: "" });
  const router = useRouter();

  useEffect(() => {
    handleFilterChange(filters);
  }, [merchants]);

  const handleFilterChange = (filters: {
    statuses: string[];
    email: string;
  }) => {
    setFilters(filters)
    const { statuses, email } = filters;
    const filtered = merchants.filter((merchant) => {
      const matchesStatus =
        statuses.length === 0 ||
        (merchant.leadStatus && statuses.includes(merchant.leadStatus));
      const matchesEmail =
        email === "" || (merchant.email && merchant.email.includes(email));
      return matchesStatus && matchesEmail;
    });
    setFilteredMerchants(filtered);
  };

  async function handleLeadStatusChange(leadId: string, value: string) {
    await updateLeadStatusAction(leadId, value);
    router.refresh();
  }

  const merchantColumns: ColumnDef<Merchant>[] = [
    {
      accessorKey: "name",
      header: "Nome referente",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "notes",
      header: "Note",
      cell: (info) => <EditableCell initialValue={info.getValue()} updateMyData={(value) => updateNotesAction(info.row.original.id, value)} />,
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
      accessorKey: "leadStatus",
      header: "Stato",
      cell: (info) => {
        const status = info.getValue() as string;

        // Define a mapping for colors
        const statusColors: Record<string, string> = {
          to_contact: "#FFA500", // Orange
          awaiting_response: "#FFD700", // Yellow
          appointment_set: "#32CD32", // Green
          to_cancel: "#FF4500", // Red
          history: "#808080", // Gray
        };

        // Define a mapping for text
        const statusText: Record<string, string> = {
          to_contact: "Da contattare",
          awaiting_response: "In attesa di risposta",
          appointment_set: "Fissato appuntamento",
          to_cancel: "Da annullare",
          history: "Storico",
        };

        // Get the color and text for the current status
        const color = statusColors[status] || "#000000"; // Default to black if not defined
        const text = statusText[status] || status;

        return (
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
          </span>
        );
      },
      sortingFn: (a, b) => {
        const statusOrder = {
          to_contact: 1,
          awaiting_response: 2,
          appointment_set: 3,
          to_cancel: 4,
          history: 5,
        };
        return (
          statusOrder[a.getValue('leadStatus') || "to_contact"] -
          statusOrder[b.getValue('leadStatus') || "to_contact"]
        );
      }
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
          <Menu>
            <MenuButton as={Button} size="sm" ml="2" variant="outline">
              Cambia Stato
            </MenuButton>
            <MenuList>
                <MenuItem onClick={() => handleLeadStatusChange(info.row.original.id, 'to_contact')}>
                  Da contattare
                </MenuItem>
                <MenuItem onClick={() => handleLeadStatusChange(info.row.original.id, 'awaiting_response')}>
                  In attesa di risposta
                </MenuItem>
                <MenuItem onClick={() => handleLeadStatusChange(info.row.original.id, 'appointment_set')}>
                  Fissato appuntamento
                </MenuItem>
                <MenuItem onClick={() => handleLeadStatusChange(info.row.original.id, 'to_cancel')}>
                  Da annullare
                </MenuItem>
                <MenuItem onClick={() => handleLeadStatusChange(info.row.original.id, 'history')}>
                  Storico
                </MenuItem>
              </MenuList>
          </Menu>
        </>
      ),
    },
  ];

  return (
    <>
      <PendingMerchantsFilters onChange={handleFilterChange} />
      <GenericTable
        data={filteredMerchants}
        columns={merchantColumns}
        title="Lead"
        itemsPerPage={100}
      />
    </>
  );
}

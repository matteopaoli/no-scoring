"use client";

import { ColumnDef } from "@tanstack/react-table";
import GenericTable from "@/app/components/GenericTable"; // Adjust the import path if needed
import { Switch } from "@chakra-ui/react";
import changeStoreStatus from "./changeStoreStatus.action";
import { useRouter } from "next/navigation";
import StoreFilters from "./StoreFilters";
import { startTransition, useState } from "react";
import SwitchField from "@/app/components/fields/SwitchField";

interface Store {
  id: string;
  storeName: string;
  storeImage: string | null;
  isSubscriptionActive: boolean;
  createdAt: Date | null;
  totalCommission: number;
  totalVolume: number;
}

interface StoresTableProps {
  stores: Store[];
  canDisable: boolean;
}

export default function StoresTable({ stores, canDisable }: StoresTableProps) {
  const [filtered, setFiltered] = useState(stores);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  const storeColumns: ColumnDef<Store>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "subscriptionFee",
      header: "Guadagno iscrizione",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "ownedBy",
      header: "Utente",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "partnerName",
      header: "Partner",
      cell: (info) =>
        (info.getValue() as string).trim() ? info.getValue() : "—",
    },
    {
      accessorKey: "totalCommission",
      header: "Commissione",
      cell: (info) => `€ ${Number(info.getValue() ?? 0).toFixed(2)}`,
    },
    {
      accessorKey: "totalVolume",
      header: "Volume",
      cell: (info) => `€ ${Number(info.getValue() ?? 0).toFixed(2)}`,
    },
    {
      accessorKey: "commissionsCurrentMonth",
      header: "Commssioni guadagnate (mese corrente)",
      cell: (info) => `€ ${Number(info.getValue() ?? 0).toFixed(2)}`,
    },
    {
      accessorKey: "volumeCurrentMonth",
      header: "Volume (mese corrente)",
      cell: (info) => `€ ${Number(info.getValue() ?? 0).toFixed(2)}`,
    },
    {
      accessorKey: "createdAt",
      header: "Data Creazione",
      cell: (info) =>
        new Date(info.getValue() as string).toLocaleDateString("it-IT", {
          dateStyle: "long",
        }),
    },
    ...(canDisable
      ? [
          {
            accessorKey: "actions",
            header: "",
            cell: (info) => (
              <Switch
                id={`toggle_${info.row.original.id}`}
                onChange={() =>
                  activeStatusToggleChangeHandler(
                    info.row.original.id,
                    !info.row.original.isSubscriptionActive
                  )
                }
                isChecked={info.row.original.isSubscriptionActive}
                isDisabled={updatingIds.has(info.row.original.id)}
              />
            ),
          },
        ]
      : []),
  ];

  const router = useRouter();

  const activeStatusToggleChangeHandler = async (
    id: string,
    value: boolean
  ) => {
    setUpdatingIds((prev) => new Set(prev).add(id));

    try {
      await changeStoreStatus(id, value);
      setFiltered((prev) =>
        prev.map((store) =>
          store.id === id ? { ...store, isSubscriptionActive: value } : store
        )
      );
    } catch (error) {
      console.error("Failed to update store status:", error);
    } finally {
      setUpdatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleFilterChange = (filters: { text: string }) => {
    const { text } = filters;
    const filtered = stores.filter((store) => {
      return ["ownedBy", "partnerName", "name"].some((key) =>
        store[key]?.toLowerCase().includes(text.toLowerCase())
      );
    });
    setFiltered(filtered);
  };

  return (
    <>
      <StoreFilters onChange={handleFilterChange} />
      <GenericTable
        data={filtered}
        columns={storeColumns}
        title="Negozi Attivi"
        itemsPerPage={10}
        hideColumnsResponsive={["createdAt"]}
        getRowProps={(row) => ({
          style: {
            backgroundColor: row.original.hasPaid
              ? "rgba(0, 255, 0, 0.1)"
              : "transparent",
          },
        })}
      />
    </>
  );
}

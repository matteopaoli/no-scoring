"use client";

import { ColumnDef } from "@tanstack/react-table";
import GenericTable from "@/app/components/GenericTable"; // Adjust the import path if needed
import { Switch } from '@chakra-ui/react'
import changeStoreStatus from "./changeStoreStatus.action";
import { useRouter } from "next/navigation";

interface Store {
  storeId: string;
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
    ...(canDisable ? [{
      accessorKey: "actions",
      header: "",
      cell: (info) => <Switch onChange={() => activeStatusToggleChangeHandler(info.row.original.storeId, !info.row.original.isSubscriptionActive)} isChecked={info.row.original.isSubscriptionActive} />
    }]: [])

  ];

  const router = useRouter();

  const activeStatusToggleChangeHandler = async (id: string, value: boolean) => {
    await changeStoreStatus(id, value)
    await router.refresh();
  }

  return (
    <>
      <GenericTable
        data={stores}
        columns={storeColumns}
        title="Negozi Attivi"
        itemsPerPage={100}
        hideColumnsResponsive={["createdAt"]}
      />
    </>
  );
}

"use client";

import { ColumnDef } from "@tanstack/react-table";
import GenericTable from "@/app/components/GenericTable"; // Adjust the import path if needed
import { Box, Button, useToast } from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";

interface Store {
  storeId: string;
  storeName: string;
  storeImage: string | null;
  createdAt: Date | null;
  totalCommission: number;
  totalVolume: number;
}

interface StoresTableProps {
  stores: Store[];
}

export default function StoresTable({ stores }: StoresTableProps) {
  const toast = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Chiave copiata",
      description: "La chiave API è stata copiata negli appunti.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const storeColumns: ColumnDef<Store>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "subscriptionFee",
      header: "Commissioni d'iscrizione",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "partnerName",
      header: "Partner di riferimento",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "totalCommission",
      header: "Commissioni guadagnate (Totale)",
      cell: (info) => `€ ${Number(info.getValue() ?? 0).toFixed(2)}`,
    },
    {
      accessorKey: "totalVolume",
      header: "Volume (Totale)",
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
      accessorKey: "apiKey",
      header: "Chiave API",
      cell: (info) => (
        <>
          {info.getValue() ? (
            <Box display="flex" gap={2} alignItems="center">
              <Button
                aria-label="Copy API key"
                rightIcon={<CopyIcon />}
                size="sm"
                variant="outline"
                onClick={() => handleCopy(info.getValue() as string)}
              >
                Copia Chiave API
              </Button>
            </Box>
          ) : (
            "N/A"
          )}
        </>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Data Creazione",
      cell: (info) =>
        new Date(info.getValue() as string).toLocaleDateString("it-IT", {
          dateStyle: "long",
        }),
    },
  ];

  return (
    <>
      <GenericTable
        data={stores}
        columns={storeColumns}
        title="Negozi Attivi"
        itemsPerPage={10} // Customize the number of items per page if needed
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

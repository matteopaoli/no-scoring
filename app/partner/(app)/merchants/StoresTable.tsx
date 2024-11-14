"use client";

import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import GenericTable from "@/app/components/GenericTable"; // Adjust the import path if needed
import ReferLeadForm from "@/app/components/forms/PartnerCreateMerchantForm";

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
  const storeColumns: ColumnDef<Store>[] = [
    {
      accessorKey: "storeName",
      header: "Nome",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "totalCommission",
      header: "Commissione",
      cell: (info) => `€ ${Number(info.getValue()).toFixed(2)}`,
    },
    {
      accessorKey: "totalVolume",
      header: "Volume",
      cell: (info) => `€ ${Number(info.getValue()).toFixed(2)}`,
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
        hideColumnsResponsive={['createdAt']}
      />
    </>
  );
}

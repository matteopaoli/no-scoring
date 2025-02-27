"use client";
/* eslint-disable */
import {
  createColumnHelper,
} from "@tanstack/react-table";
import { useState } from "react";
import GenericTable from "@/app/components/GenericTable";

type SubPartnersTableProps = {
  tableData: {
    firstName: string | null;
    lastName: string | null;
    regionName: string;
    email: string | null;
    totalCommission: number;
  }[];
};

const columnHelper = createColumnHelper<{
  firstName: string | null;
  lastName: string | null;
  regionName: string;
  email: string | null;
  totalCommission: number;
}>();

export default function SubPartnersTable({ tableData }: SubPartnersTableProps) {
  const columns = [
    {
      accessorKey: 'name',
      header: "Nome e Cognome",
      cell: (info) => `${info.row.original.firstName ?? ""} ${info.row.original.lastName ?? ""}`,
    },
    {
      accessorKey: "regionName",
      header: "Provincia",
      cell: (info) => info.row.original.regionName || "-",
    },
    {
      accessorKey: 'email',
      header: "E-mail",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "totalCommission",
      header: "Commissioni Dovute",
      cell: (info) => `€ ${(info.getValue() as number).toFixed(2)}`,
    }
  ]

  const [data] = useState(() => [...tableData]);

  return <GenericTable data={data} columns={columns} title="Agenti" />;
}

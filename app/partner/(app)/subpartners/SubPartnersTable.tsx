"use client";

import GenericTable from "@/app/components/GenericTable";
import SubPartnersTableMenu from "./SubPartnersTableMenu";
import { useRouter } from "next/navigation";

type SubPartnersTableProps = {
  tableData: {
    firstName: string | null;
    lastName: string | null;
    provincia: string | null;
    email: string | null;
  }[];
};

export default function SubPartnersTable({ tableData }: SubPartnersTableProps) {
  const router = useRouter();
  const columns = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: (info) =>
        `${info.row.original.firstName ?? ""} ${
          info.row.original.lastName ?? ""
        }`,
    },
    {
      accessorKey: "provincia",
      header: "Provincia",
      cell: (info) => info.row.original.provincia || "-",
    },
    {
      accessorKey: "email",
      header: "E-mail",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "earnings",
      header: "Guadagni generati",
      cell: (info) => `€ ${info.getValue().toFixed(2)}`,
    },
    {
      accessorKey: "earningsCurrentMonth",
      header: "Guadagni generati (mese corrente)",
      cell: (info) => `€ ${info.getValue().toFixed(2)}`,
    },
  ];
  
  const onRowClick = (row: any) => {
    router.push(`/partner/subpartners/${row.id}`);
  };

  return (
    <GenericTable
      columns={columns}
      data={tableData}
      title="Agenti"
      onRowClick={onRowClick}
      itemsPerPage={10}
      menu={SubPartnersTableMenu}
    />
  );
}

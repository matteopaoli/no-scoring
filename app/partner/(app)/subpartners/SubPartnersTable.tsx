"use client";

import GenericTable from "@/app/components/GenericTable";
import SubPartnersTableMenu from "./SubPartnersTableMenu";

type SubPartnersTableProps = {
  tableData: {
    firstName: string | null;
    lastName: string | null;
    provincia: string | null;
    email: string | null;
  }[];
};

export default function SubPartnersTable({ tableData }: SubPartnersTableProps) {
  console.log(tableData)
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
  ];

  return (
    <GenericTable
      columns={columns}
      data={tableData}
      title="Agenti"
      itemsPerPage={10}
      menu={SubPartnersTableMenu}
    />
  );
}

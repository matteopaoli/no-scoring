"use client";
/* eslint-disable */

import { Icon, Tooltip } from "@chakra-ui/react";
import { MdOutlineEdit } from "react-icons/md";
import Menu from "./UsersTableMenu";
import { useMemo, useState } from "react";
import { Link } from "@chakra-ui/next-js";
import GenericTable from "@/app/components/GenericTable";
import DeleteUserButton from "./DeleteUserButton";
import UsersFilters from "./UsersFilters";

type UsersTableProps = {
  tableData: unknown[];
};

export default function UsersTable({ tableData }: UsersTableProps) {
  const [filtered, setFiltered] = useState(tableData);
  const columns = useMemo(
    () => [
      {
        accessorKey: "refName",
        header: "Nome Referente",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "storeName",
        header: "Negozio",
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
        accessorKey: "regionName",
        header: "Provincia",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "partnerName",
        header: "Partner",
        cell: (info) =>
          (info.getValue() as string).trim() ? info.getValue() : "—",
      },
      {
        accessorKey: "actions",
        header: "",
        cell: (info) => (
          <>
            <Tooltip label="Modifica utente" hasArrow placement="auto">
              <Link href={`/admin/users/edit/${info.row.original.id}`}>
                <Icon
                  as={MdOutlineEdit}
                  width="20px"
                  height="20px"
                  color="inherit"
                  cursor="pointer"
                />
              </Link>
            </Tooltip>
            <DeleteUserButton userId={info.row.original.id} />
          </>
        ),
      },
    ],
    []
  );

  const handleFilterChange = (filters: { text: string }) => {
    const { text } = filters;
    const filtered = tableData.filter((user) => {
      return ["refName", "partnerName", "email", "regionName"].some((key) =>
        user[key]?.toLowerCase().includes(text.toLowerCase())
      );
    });
    setFiltered(filtered);
  };

  return (
    <>
      <UsersFilters onChange={handleFilterChange} />
      <GenericTable
        columns={columns}
        data={filtered}
        title="Merchant attivi"
        itemsPerPage={10}
        menu={Menu}
      />
    </>
  );
}

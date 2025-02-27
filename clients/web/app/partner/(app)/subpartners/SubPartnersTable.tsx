"use client";

import GenericTable from "@/app/components/GenericTable";
import SubPartnersTableMenu from "./SubPartnersTableMenu";
import { useRouter } from "next/navigation";
import { Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import styles from './Table.module.css'
import { MdArrowForward } from "react-icons/md";

type SubPartnersTableProps = {
  tableData: {
    firstName: string | null;
    lastName: string | null;
    provincia: string | null;
    email: string | null;
  }[];
};

export default function SubPartnersTable({ tableData }: SubPartnersTableProps) {
  const textColor = useColorModeValue("secondaryGray.900", "white");
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
      accessorKey: "regionName",
      header: "Provincia",
      cell: (info) => info.row.original.regionName || "-",
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
    {
      accessorKey: "details",
      header: "Dettagli",
      cell: () => (
        <Flex as="span" alignItems="center">
          <Icon
            as={MdArrowForward}
            color="navy.700"
            width="24px"
            className={styles.icon}
            me="16px"
          />
          <Text
            color={textColor}
            textDecoration="underline"
            fontSize="sm"
            fontWeight="700"
          >
            Dettagli Agente
          </Text>
        </Flex>
      ),
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

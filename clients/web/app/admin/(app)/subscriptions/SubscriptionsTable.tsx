"use client";
import { Box } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import GenericTable from "@/app/components/GenericTable";
import EditableNumberCell from "./EditableNumberCell";
import updateSubscriptionAction from "./updateSubscription.action";

type SubscriptionsTableProps = {
  tableData: any[];
};

export default function SubscriptionsTable({
  tableData,
}: SubscriptionsTableProps) {

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "storeName",
      header: "Negozio",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "amount",
      header: "Importo",
      cell: (info) => <EditableNumberCell initialValue={Number(info.getValue())} updateMyData={(value) => updateSubscriptionAction(info.row.original.id, 'paytomorrow', value)} />,

    },
    {
      accessorKey: "partnerName",
      header: "Partner",
      cell: (info) => {
        if (info.row.original.partnerId) {
          return info.getValue();
        }
        return '-'
      }
    },
    {
      accessorKey: "partnerFee",
      header: "Commissione Partner",
      cell: (info) => {
        if (info.row.original.partnerId) {
          return <EditableNumberCell initialValue={Number(info.getValue())} updateMyData={(value) => updateSubscriptionAction(info.row.original.id, 'partner', value, info.row.original.partnerId)} />
        }
        return '-'
      },
    },
    {
      accessorKey: "upperPartnerName",
      header: "Partner Superiore",
      cell: (info) => {
        if (info.row.original.upperPartnerId) {
          return info.getValue();
        }
        return '-'
      }
    },
    {
      accessorKey: "upperPartnerFee",
      header: "Commissione Partner Superiore",
      cell: (info) => {
        if (info.row.original.upperPartnerId) {
          return <EditableNumberCell initialValue={Number(info.getValue())} updateMyData={(value) => updateSubscriptionAction(info.row.original.id, 'upperPartner', value, info.row.original.upperPartnerId)} />
        }
        return '-'
      } 
    },
  ];

  return (
    <Box>
      <GenericTable
        data={tableData}
        columns={columns}
        itemsPerPage={100}
        title="Lista Pagamenti"
      />
    </Box>
  );
}

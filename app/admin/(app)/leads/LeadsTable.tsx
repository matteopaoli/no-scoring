"use client";

import GenericTable from "@/app/components/GenericTable";
import {
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { MdAddBusiness, MdCancel, MdCheckCircle, MdMoreVert } from "react-icons/md";
import { ColumnDef } from "@tanstack/react-table";
import rejectLeadAction from "./rejectLead.action";
import { useRouter } from "next/navigation";
import acceptLeadAction from "./acceptLead.action";

interface Lead {
  id: string;
  email: string | null;
  firstName: string;
  lastName: string;
  createdAt: Date | null;
}

interface LeadsTableProps {
  leads: Lead[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const router = useRouter();

  const handleCreateNew = (leadId: string) => {
    router.push(`/admin/users/new?fromLead=${leadId}`);
  };

  const handleAccept = async (leadId: string) => {
    await acceptLeadAction(leadId);
    router.refresh()
  };

  const handleReject = async (leadId: string) => {
    await rejectLeadAction(leadId);
    router.refresh()
  };

  const leadColumns: ColumnDef<Lead>[] = [
    {
      accessorKey: "Name",
      header: "Nome",
      cell: (info) =>
        `${info.row.original.firstName} ${info.row.original.lastName}`,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "createdAt",
      header: "Data creazione",
      cell: (info) =>
        new Date(info.getValue() as Date).toLocaleDateString("it-IT"),
    },
    {
      accessorKey: "actions",
      header: "Azioni",
      cell: (info) => {
        const leadId = info.row.original.id;

        return (
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<MdMoreVert />}
              variant="outline"
              aria-label="Actions"
              
            />
            <MenuList>
              <MenuItem
                icon={<MdAddBusiness />}
                onClick={() => handleCreateNew(leadId)}
              >
                Crea nuovo merchant
              </MenuItem>
              <MenuItem
                icon={<MdCheckCircle />}
                onClick={() => handleAccept(leadId)}
              >
                Accetta contatto
              </MenuItem>
              <MenuItem
                icon={<MdCancel />}
                onClick={() => handleReject(leadId)}
              >
                Rifiuta contatto
              </MenuItem>
            </MenuList>
          </Menu>
        );
      },
    },
  ];

  return (
    <>
      <GenericTable
        data={leads}
        columns={leadColumns}
        title="Contatti Ricevuti"
        itemsPerPage={10} // Customize the number of items per page if needed
      />
    </>
  );
}

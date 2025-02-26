"use client";
import {
  Box
} from "@chakra-ui/react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import GenericTable from "@/app/components/GenericTable"; // Import the GenericTable component
import { User } from "@/app/db";
import { useRouter } from "next/navigation";
import PartnersTableMenu from "./PartnersTableMenu";

type PartnersTableProps = {
  tableData;
};

const columnHelper = createColumnHelper();

export default function PartnersTable({ tableData }: PartnersTableProps) {
  const router = useRouter();

  const columns = [
    {
      accessorKey: "firstName",
      header: "Nome",
      cell: (info) => `${info.row.original.firstName} ${info.row.original.lastName}`,
    },
    {
      accessorKey: "email",
      header: "E-mail",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "partnerName",
      header: "Partner di riferimento",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "totalCommission",
      header: "Commissioni Dovute",
      cell: (info) => `€ ${info.getValue()}`,
    },
  ];
  

  // const handleDelete = async () => {
  //   if (!selectedUserId) return;
  //   try {
  //     // Uncomment and modify this fetch call according to your API
  //     // const response = await fetch(`/api/users/${selectedUserId}`, {
  //     //   method: "DELETE",
  //     // });
  //     // if (response.ok) {
  //     //   // Handle successful deletion (e.g., refetch data or update state)
  //     //   console.log("User deleted successfully");
  //     // }
  //   } catch (error) {
  //     console.error("Error deleting user:", error);
  //   } finally {
  //     setSelectedUserId(null);
  //     onClose();
  //     window.location.reload(); // Consider using state management or re-fetching instead
  //   }
  // };

  const onRowClick = (row: any) => {
    router.push(`/admin/partners/${row.id}`);
  };

  return (
    <Box>
      <GenericTable
        data={tableData}
        columns={columns}
        itemsPerPage={100}
        title="Lista Partner"
        onRowClick={onRowClick} // Pass the row click handler to GenericTable
        menu={PartnersTableMenu}
      />
      {/* Confirmation Modal */}
      {/* <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Conferma Eliminazione</ModalHeader>
          <ModalBody>Sei sicuro di voler eliminare questo partner?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Annulla
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Elimina
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
    </Box>
  );
}

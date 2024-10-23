"use client";
import {
  Box
} from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import GenericTable from "@/app/components/GenericTable"; // Import the GenericTable component
import { User } from "@/app/db";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type PartnersTableProps = {
  tableData;
};

const columnHelper = createColumnHelper();

export default function PartnersTable({ tableData }: PartnersTableProps) {
  const router = useRouter();

  const columns = useMemo(
    () => [
      columnHelper.accessor("firstName", {
        id: "name",
        header: () => "Nome",
        cell: (info) =>
          `${info.row.original.firstName} ${info.row.original.lastName}`,
      }),
      columnHelper.accessor("email", {
        id: "email",
        header: () => "E-mail",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("totalCommission", {
        id: "totalCommission",
        header: () => "Commissioni Dovute",
        cell: (info) => `€ ${(info.getValue() as number).toFixed(2)}`,
      }),
    ],
    []
  );

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
        itemsPerPage={10}
        title="Lista Partner"
        onRowClick={onRowClick} // Pass the row click handler to GenericTable
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

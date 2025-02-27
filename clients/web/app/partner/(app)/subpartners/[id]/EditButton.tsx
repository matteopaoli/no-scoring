'use client'

import { IconButton } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { MdOutlineEdit } from "react-icons/md"

export default function EditButton({userId}: { userId: string }) {
  const router = useRouter()

  const handleEditClick = () => {
    router.push(`/admin/partners/edit/${userId}`)
  }
  return (
        <IconButton variant="outline" colorScheme="brand" size="lg" icon={<MdOutlineEdit/>} aria-label="Modifica Partner" onClick={handleEditClick} />

  )
}
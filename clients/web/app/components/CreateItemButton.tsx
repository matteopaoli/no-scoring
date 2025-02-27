import { Link } from "@chakra-ui/next-js";
import { Button } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { MdAddCircleOutline } from "react-icons/md";

type CreateItemButtonProps = {
  href: string
  children?: string
  icon?: IconType
}

export default function CreateItemButton({ href, children = "Crea nuovo", icon: Icon = MdAddCircleOutline }: CreateItemButtonProps) {
  return (
    <Link href={href}>
      <Button leftIcon={<Icon />} colorScheme="brand">{children}</Button>
    </Link>
  )
}
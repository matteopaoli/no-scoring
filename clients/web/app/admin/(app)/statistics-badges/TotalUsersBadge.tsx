"use client";

import IconBox from "@/app/components/icons/IconBox";
import { Icon } from "@chakra-ui/react";
import { MdOutlineGroup } from "react-icons/md";
import MiniStatistics from "@/app/components/card/MiniStatistics";


export default function TotalUsersBadge({ value }: { value: number }) {
  return (
    <MiniStatistics
      startContent={
        <IconBox
          w="56px"
          h="56px"
          bg="secondaryGray.300"
          icon={
            <Icon w="32px" h="32px" as={MdOutlineGroup} color="brand.500" />
          }
        />
      }
      name="Utenti totali"
      value={value}
    />
  );
}

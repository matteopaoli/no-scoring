"use client";

import IconBox from "@/app/components/icons/IconBox";
import { Icon } from "@chakra-ui/react";
import { MdOutlineNewReleases } from "react-icons/md";
import MiniStatistics from "@/app/components/card/MiniStatistics";

export default function UsersInCurrentMonthBadge({ value }: { value: number }) {
  return (
    <MiniStatistics
      startContent={
        <IconBox
          w="56px"
          h="56px"
          bg="secondaryGray.300"
          icon={
            <Icon
              w="32px"
              h="32px"
              as={MdOutlineNewReleases}
              color="green.500"
            />
          }
        />
      }
      name="Nuovi utenti (Mese corrente)"
      value={value}
    />
  );
}

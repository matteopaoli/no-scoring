"use client";

import IconBox from "@/app/components/icons/IconBox";
import { Icon } from "@chakra-ui/react";
import { MdEuroSymbol } from "react-icons/md"; // You can choose a different icon if you prefer
import MiniStatistics from "@/app/components/card/MiniStatistics";

export default function RevenueBadge({ value }: { value: number }) {
  return (
    <MiniStatistics
      startContent={
        <IconBox
          w="56px"
          h="56px"
          bg="secondaryGray.300"
          icon={
            <Icon w="32px" h="32px" as={MdEuroSymbol} color="brand.500" />
          }
        />
      }
      name="Entrate totali" // Adjust the label as needed
      value={`€${value.toFixed(2)}`} // Format the revenue value as currency
    />
  );
}

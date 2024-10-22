"use client";

import { Box, SimpleGrid, Icon } from "@chakra-ui/react";
import MiniStatistics from "@/app/components/card/MiniStatistics";
import IconBox from "@/app/components/icons/IconBox";
import {
  MdOutlineShoppingCart,
  MdTrendingUp,
  MdOutlineReceipt,
  MdOutlineAttachMoney,
} from "react-icons/md";

export default function Statistics({
  data,
}: {
  data: {
    totalCommission: number;
    volume: number;
    totalCommissionThirtyDays: number;
    salesVolumeThirtyDays: number;
  };
}) {
  return (
    <Box mb="8" mx="10">
      <SimpleGrid columns={{ sm: 2, md: 2, lg: 4 }} spacing="6">
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
                  as={MdOutlineAttachMoney}
                  color="green.500"
                />
              }
            />
          }
          name="Commissioni totali"
          value={`€ ${data.totalCommission.toFixed(2)}`}
        />

        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="secondaryGray.300"
              icon={
                <Icon w="32px" h="32px" as={MdTrendingUp} color="blue.500" />
              }
            />
          }
          name="Volume di vendita"
          value={`€ ${data.volume.toFixed(2)}`}
        />

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
                  as={MdOutlineAttachMoney}
                  color="green.500"
                />
              }
            />
          }
          name="Commissioni guadagnate (ultimi 30 giorni)"
          value={`€ ${data.totalCommissionThirtyDays.toFixed(2)}`}
        />

        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="secondaryGray.300"
              icon={
                <Icon w="32px" h="32px" as={MdTrendingUp} color="blue.500" />
              }
            />
          }
          name="Volume di vendita (ultimi 30 giorni)"
          value={`€ ${data.salesVolumeThirtyDays.toFixed(2)}`}
        />

        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="secondaryGray.300"
              icon={
                <Icon w="32px" h="32px" as={MdTrendingUp} color="blue.500" />
              }
            />
          }
          name="Volume di vendita (ultimi 30 giorni)"
          value={`€ ${data.salesVolumeThirtyDays.toFixed(2)}`}
        />

        {/*
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
                  as={MdOutlineReceipt}
                  color="purple.500"
                />
              }
            />
          }
          name="Importo (ultimi 30 giorni)"
          value={`€${data.recentAmount.toFixed(2)}`}
        /> */}
      </SimpleGrid>
    </Box>
  );
}

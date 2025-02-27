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
    firstLevelCommission: number;
    secondLevelCommission: string | null;
    totalCommission: number | null;
    salesVolume: number;
    salesVolumeStartofMonth: number;
  };
}) {

  const firstLevelCommission = data.firstLevelCommission.toFixed(2);
  return (
    <Box mb="8" mx="10">
      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing="6">
        {data.secondLevelCommission != null ? (
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
                    as={MdOutlineShoppingCart}
                    color="brand.500"
                  />
                }
              />
            }
            name="Totale commissioni indirette"
            value={`€ ${ data.secondLevelCommission}`}
          />
        ) : null}
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
                  as={MdOutlineShoppingCart}
                  color="brand.500"
                />
              }
            />
          }
          name="Totale commissioni dirette"
          value={`€ ${firstLevelCommission}`}
        />
        {
          data.totalCommission != null ? (
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
              value={`€ ${Number(data.totalCommission).toFixed(2)}`}
            />
          ) : null
        }
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
          value={`€ ${Number(data.salesVolume).toFixed(2)}`}
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
          name="Volume di vendita (mese corrente)"
          value={`€ ${Number(data.salesVolumeStartofMonth).toFixed(2)}`}
        />
        {/*
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
          name="Vendite (ultimi 30 giorni)"
          value={data.recentSales}
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

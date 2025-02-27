"use client";

import { Box, SimpleGrid, Icon } from "@chakra-ui/react";
import MiniStatistics from "@/app/components/card/MiniStatistics";
import IconBox from "@/app/components/icons/IconBox";
import {
  MdOutlineShoppingCart,

} from "react-icons/md";

export default function Statistics({ merchants }: { merchants: number }) {
  return (
    <Box mb="8" mx="10">
      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing="6">
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
          name="Lead totali"
          value={merchants}
        />
      </SimpleGrid>
    </Box>
  );
}

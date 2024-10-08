'use client'

import { Box, SimpleGrid, Icon } from '@chakra-ui/react'
import MiniStatistics from '@/app/components/card/MiniStatistics'
import IconBox from '@/app/components/icons/IconBox'
import { MdOutlineShoppingCart, MdTrendingUp, MdOutlineReceipt, MdOutlineAttachMoney } from 'react-icons/md'

export default function Statistics({ data }: { data: Record<string, number> }) {
  return (
    <Box mb="8" mx="10">
      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing="6">
        {/* Total Sales */}
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
          name="Vendite"
          value={data.totalSales}
        />

        {/* Total Amount */}
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
          name="Importo totale"
          value={`€${data.totalAmount.toFixed(2)}`}
        />

        {/* Recent Sales */}
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
                  as={MdTrendingUp}
                  color="blue.500"
                />
              }
            />
          }
          name="Vendite (ultimi 30 giorni)"
          value={data.recentSales}
        />

        {/* Recent Amount */}
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
        />
      </SimpleGrid>
    </Box>
  )
}

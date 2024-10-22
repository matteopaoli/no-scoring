import { auth } from "@/app/auth"
import { getUser, getStoresByPartnerId, getAllPartnerFees } from "@/app/db"
import StoresTable from "./StoresTable"
import { InactiveMerchantsTable } from "./InactiveMerchantsTable"
import Statistics from "./Statistics"
import { Box, SimpleGrid } from "@chakra-ui/react"



export default async function MerchantsPage() {
  const session = await auth()
  const user = await getUser(session?.user?.email)
  const { inactiveMerchants } = await getStoresByPartnerId(user.id)
  const { firstLevelCommission, secondLevelCommission, totalCommission } = await getAllPartnerFees(user.id)
  return (
    <>
      <Statistics data={{ firstLevelCommission, secondLevelCommission, totalCommission }}/>
      <SimpleGrid columns={{ base: 1, '2xl': 2 }}>
        <StoresTable stores={stores} />
      <Box>
        <InactiveMerchantsTable merchants={inactiveMerchants} />
      </Box>

      </SimpleGrid>
    </> 
  )
}
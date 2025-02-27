import { Box, SimpleGrid, Icon } from "@chakra-ui/react";
import MiniStatistics from "@/app/components/card/MiniStatistics";
import IconBox from "@/app/components/icons/IconBox";
import {
  MdPersonOutline,
  MdProductionQuantityLimits,
  MdOutlineNewReleases,
  MdOutlineGroup,
} from "react-icons/md";
import TotalUsersBadge from "../../admin/(app)/statistics-badges/TotalUsersBadge"
import RevenueBadge from "../../admin/(app)/statistics-badges/RevenueBadge";

export default async function Statistics({
  merchants,
  sales,
}: {
  merchants: {
    firstName: string | null;
    lastName: string | null;
    productCount: number;
    createdAt: Date | null;
  }[];
  sales: {
    id: string;
    createdAt: Date | null;
    storeId: string;
    amount: string;
    stripePaymentIntentId: string;
    legCommission: string;
    firstLevelPartnerCommission: string;
    secondLevelPartnerCommission: string;
  }[];
}) {
  const totalProducts = merchants.reduce((acc, v) => acc + v.productCount, 0);
  const totalUsers = merchants.length;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const usersInLast30Days = merchants.filter(
    (user) => user.createdAt >= thirtyDaysAgo
  ).length;

  return (
    <Box mb="8" mx="10">
      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing="6">
        <TotalUsersBadge value={totalUsers} />
        {/* <TotalProductsBadge value={totalProducts} />
        <UsersInLastThirtyDaysBadge value={usersInLast30Days} /> */}
        <RevenueBadge value={1243.54} />
      </SimpleGrid>
    </Box>
  );
}

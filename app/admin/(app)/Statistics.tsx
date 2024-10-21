import { Box, SimpleGrid, Icon } from "@chakra-ui/react";
import MiniStatistics from "@/app/components/card/MiniStatistics";
import IconBox from "@/app/components/icons/IconBox";
import {
  MdPersonOutline,
  MdProductionQuantityLimits,
  MdOutlineNewReleases,
  MdOutlineGroup,
} from "react-icons/md";
import TotalUsersBadge from "./statistics-badges/TotalUsersBadge";
import TotalProductsBadge from "./statistics-badges/TotalProductsBadge";
import UsersInLastThirtyDaysBadge from "./statistics-badges/UsersInLastThirtyDaysBadge";
import RevenueBadge from "./statistics-badges/RevenueBadge";

export default async function Statistics({
  merchants,
  revenue
}: {
  merchants: {
    firstName: string | null;
    lastName: string | null;
    productCount: number;
    createdAt: Date | null;
  }[];
  revenue: number,
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
        <TotalProductsBadge value={totalProducts} />
        <UsersInLastThirtyDaysBadge value={usersInLast30Days} />
        <RevenueBadge value={revenue} />
      </SimpleGrid>
    </Box>
  );
}

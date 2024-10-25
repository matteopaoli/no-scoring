import { getSales, getUser, getUsersWithStoresAndCommissions } from "@/app/db";
import UsersTable from "./UsersTable";
import { auth } from "@/app/auth";
import Statistics from "./Statistics";

export default async function UsersPage() {
  const session = await auth();
  const user = await getUser(session?.user?.email);

  const [users, sales] = await Promise.all([
    getUsersWithStoresAndCommissions(),
    getSales(user.id, user.role),
  ]);

  interface Accumulator {
    legRevenue: number;
    salesVolume: number;
  }

  const { legRevenue, salesVolume } = sales?.reduce<Accumulator>(
    (obj, sale) => ({
      legRevenue: obj.legRevenue + Number(sale.legCommission),
      salesVolume: obj.salesVolume + Number(sale.amount),
    }),
    { legRevenue: 0, salesVolume: 0 }
  ) || { legRevenue: 0, salesVolume: 0 };

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const {
    legRevenue: totalCommissionMonthToDate,
    salesVolume: salesVolumeMonthToDate,
  } = sales
    ?.filter((sale) => {
      return sale.createdAt && sale.createdAt >= startOfMonth; // Filter for sales in the last 30 days
    })
    .reduce<Accumulator>(
      (obj, sale) => ({
        legRevenue: obj.legRevenue + Number(sale.legCommission),
        salesVolume: obj.salesVolume + Number(sale.amount),
      }),
      { legRevenue: 0, salesVolume: 0 }
    ) || { legRevenue: 0, salesVolume: 0 };

  return (
    <>
      <Statistics
        data={{
          totalCommission: legRevenue,
          volume: salesVolume,
          totalCommissionMonthToDate,
          salesVolumeMonthToDate,
        }}
      />
      <UsersTable tableData={users} />;
    </>
  );
}

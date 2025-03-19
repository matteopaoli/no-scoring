import { getEarningsDetails, getSales } from "@/app/db";
import UsersTable from "./UsersTable";
import Statistics from "./Statistics";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import { MerchantService } from "@/app/services/merchantService";

export default async function UsersPage() {
  const user = await getUserFromAuth();

  const [users, sales] = await Promise.all([
    MerchantService.getMerchantsWithDetailedMetrics(user.id),
    getSales(user.id),
  ]);

  const now = new Date;
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const salesVolume = sales.reduce((acc, current) => acc += Number(current.amount), 0);
  const salesVolumeMonthToDate = sales.filter((x) => {
    return (
      x.createdAt!.getMonth() === currentMonth &&
      x.createdAt!.getFullYear() === currentYear
    );
  }).reduce((acc, current) => acc += Number(current.amount), 0);

  const earnings = await getEarningsDetails(user.id)
  const totalEarnings = earnings.reduce((acc, current) => acc += Number(current.amount), 0);
  const earningsMonthToDate = earnings.filter((x) => {
    return (
      x.createdAt?.getMonth() === currentMonth &&
      x.createdAt?.getFullYear() === currentYear
    );
  }).reduce((acc, current) => acc += Number(current.amount), 0);
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  return (
    <>
      <Statistics
        data={{
          totalCommission: totalEarnings,
          volume: salesVolume,
          totalCommissionMonthToDate: earningsMonthToDate,
          salesVolumeMonthToDate,
        }}
      />
      <UsersTable tableData={users} />
    </>
  );
}

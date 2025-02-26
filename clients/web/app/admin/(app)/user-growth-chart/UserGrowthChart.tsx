import { useTheme } from "@chakra-ui/react";
import Chart from "react-apexcharts";

export default function UserGrowthChart({
  getNewUsers,
}: {
  getNewUsers: () => { x: string; y: number }[];
}) {
  const theme = useTheme();

  const options = {
    chart: {
      type: "line",
      height: 260,
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      type: "category",
      labels: {
        formatter: (value: string) => value,
      },
    },
    stroke: {
      curve: "smooth",
    },
    colors: [theme.colors.brand[500]],
  };

  const series = [
    {
      name: "Nuovi Utenti",
      data: getNewUsers(),
    },
  ];

  return <Chart options={options} series={series} type="line" height="100%" />;
}

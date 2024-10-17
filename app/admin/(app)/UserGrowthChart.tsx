"use client";

import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "@/app/components/card/Card"; // Assuming you have a Card component
import Chart from "react-apexcharts";
import { MdBarChart, MdOutlineCalendarToday } from "react-icons/md";
import { RiArrowUpSFill } from "react-icons/ri";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useState } from "react";

export default function UserGrowthChart({
  data,
}: {
  data: {
    firstName: string | null;
    lastName: string | null;
    productCount: number;
    createdAt: Date | null;
  }[];
}) {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("daily");

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const iconColor = useColorModeValue("brand.500", "white");

  // Helper function to group data by timeframe
  const getNewUsers = () => {
    const counts: Record<string, number> = {};
    data.forEach((user) => {
      if (!user.createdAt) return;
      const date = new Date(user.createdAt);
      let key = "";

      switch (timeframe) {
        case "daily":
          key = date.toLocaleDateString("it-IT"); // DD-MM-YYYY
          break;
        case "weekly":
          const week = new Date(date.setDate(date.getDate() - date.getDay()));
          key = week.toLocaleDateString("it-IT"); // Use first day of the week
          break;
        case "monthly":
          key = `${date.getMonth() + 1}-${date.getFullYear()}`; // MM-YYYY
          break;
      }

      counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts).map(([date, count]) => ({
      x: date,
      y: count,
    }));
  };

  const series = [
    {
      name: "Nuovi Utenti",
      data: getNewUsers(),
    },
  ];

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
  };

  // Function to toggle the timeframe
  const handleTimeframeToggle = () => {
    setTimeframe((prev) => {
      switch (prev) {
        case "daily":
          return "weekly";
        case "weekly":
          return "monthly";
        case "monthly":
          return "daily";
        default:
          return "daily"; // Fallback to daily
      }
    });
  };

  // Get the total number of new users for the current timeframe
  const totalNewUsers = getNewUsers().reduce((acc, v) => acc + v.y, 0);
  const userLabel = totalNewUsers === 1 ? "Nuovo Utente" : "Nuovi Utenti"; // Handle pluralization

  return (
    <Card
      justifyContent="center"
      align="center"
      direction="column"
      w="100%"
      mb="0px"
    >
      <Text align="left" fontWeight="bold" fontSize='2xl'>Utenti</Text>
      <Flex justify="space-between" ps="0px" pe="20px" pt="5px">
        <Flex align="center" w="100%">
          <Button
            bg={boxBg}
            fontSize="sm"
            fontWeight="500"
            color={textColorSecondary}
            borderRadius="7px"
            onClick={handleTimeframeToggle} // Toggle function
          >
            <Icon
              as={MdOutlineCalendarToday}
              color={textColorSecondary}
              me="4px"
            />
            {timeframe === "daily" ? "Oggi" : timeframe === "weekly" ? "Questa settimana" : "Questo mese"}
          </Button>
          {/* <Button
            ms="auto"
            align="center"
            justifyContent="center"
            bg={boxBg}
            w="37px"
            h="37px"
            lineHeight="100%"
            borderRadius="10px"
          >
            <Icon as={MdBarChart} color={iconColor} w="24px" h="24px" />
          </Button> */}
        </Flex>
      </Flex>
      <Flex w='100%' flexDirection={{ base: "column", lg: "row" }}>
        <Flex align="start" mb="20px" alignItems="center">
          <Text
            color={textColor}
            fontSize="34px"
            textAlign="start"
            fontWeight="700"
            lineHeight="100%"
            mr="10px" // Add some margin to separate from the chart
          >
            {totalNewUsers}
          </Text>
          <Text
            color={textColor}
            fontSize="md"
            fontWeight="500"
            lineHeight="100%"
          >
            {userLabel}
          </Text>
        </Flex>
        <Box minH="260px" minW="75%">
          <Chart
            options={options}
            series={series}
            type="line"
            height="100%"
          />
        </Box>
      </Flex>
    </Card>
  );
}

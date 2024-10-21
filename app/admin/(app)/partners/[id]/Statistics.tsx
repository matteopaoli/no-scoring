"use client";
import MiniStatistics from "@/app/components/card/MiniStatistics";
import IconBox from "@/app/components/icons/IconBox";
import { User } from "@/app/db";
import { Icon, SimpleGrid } from "@chakra-ui/react";
import {
  MdLocationOn,
  MdMonetizationOn,
  MdOutlineEmail,
  MdOutlineGroup,
} from "react-icons/md";

export default function Statistics({ partner }: { partner: User }) {
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
      <MiniStatistics
        startContent={
          <IconBox
            w="56px"
            h="56px"
            bg="secondaryGray.300"
            icon={
              <Icon w="32px" h="32px" as={MdOutlineEmail} color="brand.500" />
            }
          />
        }
        name="Email"
        value={partner.email}
      />

      <MiniStatistics
        startContent={
          <IconBox
            w="56px"
            h="56px"
            bg="secondaryGray.300"
            icon={
              <Icon w="32px" h="32px" as={MdLocationOn} color="brand.500" />
            }
          />
        }
        name="Provincia"
        value={partner.provincia || "-"}
      />

      <MiniStatistics
        startContent={
          <IconBox
            w="56px"
            h="56px"
            bg="secondaryGray.300"
            icon={
              <Icon w="32px" h="32px" as={MdMonetizationOn} color="brand.500" />
            }
          />
        }
        name="Profits"
        value="Profits!"
      />

      <MiniStatistics
        startContent={
          <IconBox
            w="56px"
            h="56px"
            bg="secondaryGray.300"
            icon={
              <Icon w="32px" h="32px" as={MdOutlineGroup} color="brand.500" />
            }
          />
        }
        name="Sub Agent Number"
        value="Sub Agent number"
      />
    </SimpleGrid>
  );
}

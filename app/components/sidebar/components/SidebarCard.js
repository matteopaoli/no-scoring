import {
  Button,
  Flex,
  Image,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

export default function SidebarDocs() {
  const bgColor = "linear-gradient(135deg, #868CFF 0%, #4318FF 100%)";
  const borderColor = useColorModeValue("white", "navy.800");

  return (
    <Flex
      justify="center"
      direction="column"
      align="center"
      bg={bgColor}
      borderRadius="30px"
      position="relative"
    >
      <Flex
        direction="column"
        mb="12px"
        align="center"
        justify="center"
        px="15px"
        py="25px"
      >
        <Text
          fontSize={{ base: "lg", xl: "18px" }}
          color="white"
          fontWeight="bold"
          lineHeight="150%"
          textAlign="center"
          px="10px"
          mt="10px"
          mb="6px"
        >
          Domande?
        </Text>
        <Text
          fontSize="14px"
          color={"white"}
          fontWeight="500"
          px="10px"
          mb="6px"
          textAlign="center"
        >
          Per informazioni e assistenza
          <br />
          <Link
            href="mailto:info@paytomorrow.it"
            textDecoration="underline"
            target="_blank"
          >
            <b>info@paytomorrow.it</b>
          </Link>{" "}
          o contattaci su WhatsApp al{" "}
          <Link
            href="https://wa.me/393514753825"
            textDecoration="underline"
            target="_blank"
          >
            <b>+39 351 475 3825</b>
          </Link>
        </Text>
      </Flex>
    </Flex>
  );
}

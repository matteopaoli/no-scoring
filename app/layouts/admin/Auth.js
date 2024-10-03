// Chakra imports
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import Footer from "@/app/components/footer/FooterAuth";

// Custom components
import { Link } from '@chakra-ui/next-js'
// Assets
import { FaChevronLeft } from "react-icons/fa";

export default function AuthIllustration(props) {
  const { children } = props;
  // Chakra color mode
  return (
    <Flex position='relative' h='max-content'>
      <Flex
        h={{
          sm: "initial",
          md: "unset",
          lg: "100vh",
        }}
        w='100%'
        // maxW={{ md: "66%", lg: "1313px" }}
        mx='auto'
        pt={{ sm: "50px", md: "0px" }}
        px={{ lg: "30px" }}
        ps={{ xl: "70px" }}
        justifyContent='start'
        direction='column'>
        <Link
          href='/admin'
          style={{
            width: "fit-content",
            marginTop: "40px",
          }}>
          {/* <Flex
            align='center'
            ps={{ base: "25px", lg: "0px" }}
            pt={{ lg: "0px", xl: "0px" }}
            w='fit-content'>
            <Icon
              as={FaChevronLeft}
              me='12px'
              h='13px'
              w='8px'
              color='secondaryGray.600'
            />
          </Flex> */}
        </Link>
        {children}
        <Footer />
      </Flex>
    </Flex>
  );
}

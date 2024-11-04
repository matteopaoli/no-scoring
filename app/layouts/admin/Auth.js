// Chakra imports
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import Footer from "@/app/components/footer/FooterAuth";

// Custom components
import { Link } from '@chakra-ui/next-js'
// Assets
import { FaChevronLeft } from "react-icons/fa";
import { PayTomorrowLogo } from "@/app/components/icons/Icons";

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
        <Box ms={{ sm: '20px', md: 0,  }}>
          <PayTomorrowLogo h='26px' w='175px' my='32px' color="navy.700" />
        </Box>
        {children}
        <Footer />
      </Flex>
    </Flex>
  );
}

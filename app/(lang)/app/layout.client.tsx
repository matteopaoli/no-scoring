"use client";

import { ReactNode, useState } from "react";
import {
  Box,
  Button,
  useDisclosure,
  Portal,
  IconButton,
} from "@chakra-ui/react";
import { Widget } from "@typeform/embed-react";
import routes from "@/app/routes.app";
import { usePathname } from "next/navigation";
import { SidebarContext } from "@/app/contexts/SidebarContext";
import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/footer/FooterAdmin";
import Sidebar from "@/app/components/sidebar/Sidebar";
import { QuestionIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import HelpButton from "./HelpButton";

export default function AppClientLayout({
  children,
  user,
  ...rest
}: Record<string, any> & { children: ReactNode }) {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);
  const pathname = usePathname();

  const getActiveRoute = (): string => {
    let activeRoute = "Default Brand Text";

    for (let i = 0; i < routes.length; i++) {
      const cleanRoute = routes[i].path.replace(/\/$/, ""); // remove trailing slash
      const cleanPathname = pathname.split("?")[0].replace(/\/$/, ""); // remove trailing slash and query parameters

      if (cleanPathname === cleanRoute) {
        return routes[i].name;
      }
    }

    return activeRoute;
  };

  const { onOpen } = useDisclosure();

  const toggleWidget = () => {
    setIsWidgetVisible((prev) => !prev);
  };

  return (
    <Box>
      <Box>
        <SidebarContext.Provider
          value={{
            toggleSidebar,
            setToggleSidebar,
          }}
        >
          <Sidebar routes={routes} {...rest} />
          <Box
            float="right"
            minHeight="100vh"
            height="100%"
            overflow="auto"
            position="relative"
            maxHeight="100%"
            w={{ base: "100%", xl: "calc( 100% - 290px )" }}
            maxWidth={{ base: "100%", xl: "calc( 100% - 290px )" }}
            transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
            transitionDuration=".2s, .2s, .35s"
            transitionProperty="top, bottom, width"
            transitionTimingFunction="linear, linear, ease"
          >
            <Portal>
              <Box>
                <Navbar
                  onOpen={onOpen}
                  brandText={getActiveRoute()}
                  secondary={true}
                  message={""}
                  fixed={false}
                  user={user}
                  routes={routes}
                  {...rest}
                />
              </Box>
            </Portal>
            <Box
              mx="auto"
              px={{ base: "20px", md: "30px" }}
              pe="20px"
              minH="100vh"
              pt="130px"
            >
              {children}
            </Box>
            <Box>
              <Footer />
            </Box>
          </Box>
        </SidebarContext.Provider>
          <HelpButton />
      </Box>
    </Box>
  );
}

"use client";

import { ReactNode, useState } from "react";
import { routes, subpartnerRoutes } from "@/app/routes.partner";
import { usePathname } from "next/navigation";
import { Box, Portal, useDisclosure } from "@chakra-ui/react";
import { SidebarContext } from "@/app/contexts/SidebarContext";
import Footer from "@/app/components/footer/FooterAdmin";
import Sidebar from "@/app/components/sidebar/Sidebar";
import PartnerNavbar from "@/app/components/navbar/NavbarPartner";

export default function AdminLayout({
  children,
  user,
  ...rest
}: Record<string, any> & { children: ReactNode }) {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const pathname = usePathname();

  const getActiveRoute = (): string => {
    let activeRoute = "Default Brand Text";

    for (let i = 0; i < routes.length; i++) {
      // Compare only the base path without considering query parameters or trailing slashes
      const cleanRoute = routes[i].path.replace(/\/$/, ""); // remove trailing slash
      const cleanPathname = pathname.split("?")[0].replace(/\/$/, ""); // remove trailing slash and query parameters

      if (cleanPathname === cleanRoute) {
        return routes[i].name;
      }
    }

    return activeRoute;
  };

  const getRoutes = () => {
    if (user.role === 'partner') return routes
    if (user.role === 'subpartner') return subpartnerRoutes
    return null
  }

  const { onOpen } = useDisclosure();
  return (
    <Box>
      <Box>
        <SidebarContext.Provider
          value={{
            toggleSidebar,
            setToggleSidebar,
          }}
        >
          <Sidebar routes={getRoutes()} display="none" {...rest} />
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
                <PartnerNavbar
                  onOpen={onOpen}
                  logoText="Horizon UI Dashboard PRO"
                  brandText={getActiveRoute()}
                  secondary={true}
                  // message={""}
                  fixed={false}
                  routes={routes}
                  user={user} 
                  {...rest}
                />
              </Box>
            </Portal>
            <Box
              mx="auto"
              px={{ base: "20px", md: "30px" }}
              pe="20px"
              minH="100vh"
              pt={{ base: "240px", md: "130px" }}
            >
              {children}
            </Box>
            <Box>
              <Footer />
            </Box>
          </Box>
        </SidebarContext.Provider>
      </Box>
    </Box>
  );
}

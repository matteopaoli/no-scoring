"use client";

import { ReactNode, useMemo, useState } from "react";
import { Box, useDisclosure, Portal, Icon } from "@chakra-ui/react";

import routes from "@/app/routes.pos";
import { usePathname } from "next/navigation";
import { SidebarContext } from "@/app/contexts/SidebarContext";
import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/footer/FooterAdmin";
import Sidebar from "@/app/components/sidebar/Sidebar";
import HelpButton from "../../(lang)/app/HelpButton";
import { MdStorefront } from "react-icons/md";

export default function AppClientLayout({
  children,
  user,
  ...rest
}: Record<string, any> & { children: ReactNode }) {
  const [toggleSidebar, setToggleSidebar] = useState(true);
  const pathname = usePathname();
  const _routes = useMemo(() => {
    if (user.role === "user")
      return [
        ...routes,
        {
          name: "Ritorna alla modalità Negozio",
          layout: '/admin',
          path: "/app",
          icon: (
            <Icon
              as={MdStorefront}
              width="20px"
              height="20px"
              color="inherit"
            />
          ),
        },
      ];
    return routes
  }, [routes, user.role]);

  const getActiveRoute = (): string => {
    let activeRoute = "Default Brand Text";

    for (let i = 0; i < _routes.length; i++) {
      const cleanRoute = _routes[i].path.replace(/\/$/, ""); // remove trailing slash
      const cleanPathname = pathname.split("?")[0].replace(/\/$/, ""); // remove trailing slash and query parameters

      if (cleanPathname === cleanRoute) {
        return _routes[i].name;
      }
    }

    return activeRoute;
  };

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
          <Sidebar routes={_routes} {...rest} />
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
                  routes={_routes}
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

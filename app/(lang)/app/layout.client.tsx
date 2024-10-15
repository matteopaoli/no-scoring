"use client";

import { ReactNode, useContext, useState } from "react";
import routes from "@/app/routes.app";
import { usePathname } from "next/navigation";
import { Box, Portal, useDisclosure } from "@chakra-ui/react";
import { SidebarContext } from "@/app/contexts/SidebarContext";
import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/footer/FooterAdmin";
import Sidebar from "@/app/components/sidebar/Sidebar";

export default function AppClientLayout({
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
      const cleanRoute = routes[i].path.replace(/\/$/, ''); // remove trailing slash
      const cleanPathname = pathname.split('?')[0].replace(/\/$/, ''); // remove trailing slash and query parameters
      
      if (cleanPathname === cleanRoute) {
        return routes[i].name;
      }
    }
    
    return activeRoute;
  };

  // const getActiveNavbar = (routes) => {
  //   let activeNavbar = false;
  //   for (let i = 0; i < routes.length; i++) {
  //     if (routes[i].collapse) {
  //       let collapseActiveNavbar = getActiveNavbar(routes[i].items);
  //       if (collapseActiveNavbar !== activeNavbar) {
  //         return collapseActiveNavbar;
  //       }
  //     } else if (routes[i].category) {
  //       let categoryActiveNavbar = getActiveNavbar(routes[i].items);
  //       if (categoryActiveNavbar !== activeNavbar) {
  //         return categoryActiveNavbar;
  //       }
  //     } else {
  //       if (
  //         window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
  //       ) {
  //         return routes[i].secondary;
  //       }
  //     }
  //   }
  //   return activeNavbar;
  // };
  // const getActiveNavbarText = (routes) => {
  //   let activeNavbar = false;
  //   for (let i = 0; i < routes.length; i++) {
  //     if (routes[i].collapse) {
  //       let collapseActiveNavbar = getActiveNavbarText(routes[i].items);
  //       if (collapseActiveNavbar !== activeNavbar) {
  //         return collapseActiveNavbar;
  //       }
  //     } else if (routes[i].category) {
  //       let categoryActiveNavbar = getActiveNavbarText(routes[i].items);
  //       if (categoryActiveNavbar !== activeNavbar) {
  //         return categoryActiveNavbar;
  //       }
  //     } else {
  //       if (
  //         window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
  //       ) {
  //         return routes[i].messageNavbar;
  //       }
  //     }
  //   }
  //   return activeNavbar;
  // };
  // const getRoutes = (routes) => {
  //   return routes.map((route, key) => {
  //     if (route.layout === '/admin') {
  //       return (
  //         <Route path={`${route.path}`} element={route.component} key={key} />
  //       );
  //     }
  //     if (route.collapse) {
  //       return getRoutes(route.items);
  //     } else {
  //       return null;
  //     }
  //   });
  // };
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
      </Box>
    </Box>
  );
}

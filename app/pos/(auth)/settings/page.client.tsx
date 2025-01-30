"use client";

import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import UpdatePOSForm from "./UpdatePOSForm";
import { User } from "@/app/db";

interface EditUserPageProps {
  user: Pick<User, "email" | "image" | "firstName" | "lastName">;
  store: {
    id: string;
    name: string;
    image: string;
  };
}

export default function EditUserPage({ user, store }: EditUserPageProps) {
  return (
    <>
      <Tabs variant="enclosed" colorScheme="brand">
        <TabList>
          <Tab>Profilo</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <UpdatePOSForm user={user} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

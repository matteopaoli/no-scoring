"use client";

import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import UpdateUserForm from "./updateUserForm";
import { User } from "@/app/db";
import UpdateStoreForm from "./updateStoreForm";

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
          <Tab>Negozio</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <UpdateUserForm user={user} />
          </TabPanel>
          <TabPanel>
            <UpdateStoreForm store={store} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

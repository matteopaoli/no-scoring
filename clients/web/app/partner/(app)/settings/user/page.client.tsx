import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import UpdateUserForm from "./updateUserForm";
import { User } from "@/app/db";

interface EditAdminPageProps {
  user: Pick<User, "email" | "image" | "firstName" | "lastName">;
}

export default function EditUserPage({ user }: EditAdminPageProps) {
  return (
    <>
      <Tabs variant="enclosed" colorScheme="brand">
        <TabList>
          <Tab>Profilo</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <UpdateUserForm user={user} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

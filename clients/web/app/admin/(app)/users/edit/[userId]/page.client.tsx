"use client";

import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { useFormState } from "react-dom";
import updateUserAction from "./updateUser.action";
import InputField from "@/app/components/fields/InputField";
import Select from "@/app/components/fields/Select";
import SubmitButton from "@/app/components/SubmitButton";
import getFormErrors from "@/app/utils/getFormErrors";
import { User } from "@/app/db";
import StoreForm from "./StoreForm";

type UpdateUserPageProps = {
  businessTypesOptions: ReactNode[];
  existingUser: User;
  existingStore: any;
};

export default function UpdateUserPage({
  businessTypesOptions,
  existingUser,
  existingStore,
}: UpdateUserPageProps) {
  const [errors, action] = useFormState(updateUserAction, []);

  return (
    <Box width="100%">
      <Tabs isFitted variant="enclosed-colored">
        <TabList mb="1em">
          <Tab _selected={{ color: "white", bg: "brand.500" }}>Utente</Tab>
          {
            !!existingStore && (
              <Tab _selected={{ color: "white", bg: "brand.500" }}>
                Negozio
              </Tab>
            )
          }
        </TabList>

        <TabPanels>
          <TabPanel>
            <form action={action} style={{ width: "100%" }}>
              <InputField
                id="user-email"
                label="Email"
                name="email"
                placeholder="mail@email.com"
                isRequired
                value={existingUser.email}
                errors={getFormErrors(errors, "email")}
                readOnly
              />

              <InputField
                id="business-name"
                label="Nome azienda"
                name="businessName"
                placeholder="Pinco Pallino s.r.l."
                isRequired
                defaultValue={existingUser.businessName}
                errors={getFormErrors(errors, "businessName")}
              />

              <Select
                id="business-type"
                label="Tipo Business"
                name="businessTypeId"
                placeholder="Seleziona uno"
                isRequired
                defaultValue={existingUser.businessTypeId}
                errors={getFormErrors(errors, "businessTypeId")}
              >
                {businessTypesOptions}
              </Select>

              <SubmitButton>Aggiorna utente</SubmitButton>
            </form>
          </TabPanel>

          {!!existingStore && (
            <TabPanel>
            <StoreForm existingStore={existingStore} />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Box>
  );
}

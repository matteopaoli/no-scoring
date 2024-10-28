'use client'

import { useFormState } from "react-dom";
import updateUserAction from "@/app/(lang)/app/settings/user/updateUser.action";
import {
  Box,
  Grid,
  GridItem,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import InputField from "@/app/components/fields/InputField";
import getFormErrors from "@/app/utils/getFormErrors";
import ProfileImageInput from "@/app/components/fields/ProfileImageInput";
import SubmitButton from "@/app/components/SubmitButton";

interface User {
  firstName: string | null;
  lastName: string | null;
  email: string;
  image: string | null;
}

export default function UpdateUserForm({ user }: { user: User }) {
  const [errors, action] = useFormState(updateUserAction, []);

  return (
    <>
      <form action={action} style={{ width: "100%" }}>
        <Grid
          templateColumns={{
            base: "1fr",
            md: "1fr 1fr",
            lg: "1fr 1fr 1fr",
          }}
          gap={6}
        >
          <GridItem>
            <Box width={{ base: "100%", md: "500px" }}>
              {/* Email (non-editable) */}
              <InputField
                id="email"
                label="Indirizzo Email"
                placeholder=""
                type="text"
                isDisabled={true}
                value={user.email}
                errors={[]}
              />

              {/* First Name */}
              <InputField
                id="firstName"
                name="firstName"
                label="Nome"
                placeholder="Inserisci il nome"
                type="text"
                defaultValue={user.firstName}
                errors={getFormErrors(errors, "firstName")}
              />

              {/* Last Name */}
              <InputField
                id="lastName"
                name="lastName"
                label="Cognome"
                placeholder="Inserisci il cognome"
                type="text"
                defaultValue={user.lastName}
                errors={getFormErrors(errors, "lastName")}
              />

              {/* Password */}
              <InputField
                id="password"
                label="Password"
                placeholder="Inserisci la nuova password"
                type="password"
                name="password"
                errors={getFormErrors(errors, "password")}
              />

              {/* Repeat Password */}
              <InputField
                id="repeatPassword"
                name="repeatPassword"
                label="Ripeti Password"
                placeholder="Ripeti la password"
                type="password"
                errors={getFormErrors(errors, "repeatPassword")}
              />
            </Box>
          </GridItem>
          <GridItem>
            <ProfileImageInput
              name="image"
              label="Immagine Profilo"
              id="profile-image"
              fullName={`${user.firstName} ${user.lastName}`}
              image={user.image}
            />
          </GridItem>
        </Grid>
        <VStack alignItems="flex-start">
          <SubmitButton>Aggiorna Profilo</SubmitButton>
        </VStack>
      </form>
    </>
  );
}

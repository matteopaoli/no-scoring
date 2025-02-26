import React from "react";
import { Box, Button, Text } from "@chakra-ui/react";

interface StepIntroductionProps {
  onNext: () => void;
}

const StepIntroduction: React.FC<StepIntroductionProps> = ({ onNext }) => {
  return (
    <Box textAlign="center">
      <Text>
        Ciao! Benvenuto in PayTomorrow. Abbiamo bisogno di alcune informazioni
        prima che tu possa iniziare.
      </Text>
      <Button
        fontSize="sm"
        variant="solid"
        colorScheme="brand"
        fontWeight="500"
        w={{ base: "100%", md: "300px" }}
        h="50"
        mt="24px"
        onClick={onNext}
        data-testid="mt-setup-step1-continue"
      >
        Inizia
      </Button>
    </Box>
  );
};

export default StepIntroduction;

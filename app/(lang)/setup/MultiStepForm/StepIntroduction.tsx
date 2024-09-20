import React from 'react';
import { Box, Button, Text } from '@chakra-ui/react';

interface StepIntroductionProps {
  onNext: () => void;
}

const StepIntroduction: React.FC<StepIntroductionProps> = ({ onNext }) => {
  return (
    <Box textAlign="center">
      <Text>
        Ciao! Benvenuto in PayTomorrow. Abbiamo bisogno di alcune informazioni prima che tu possa iniziare.
      </Text>
      <Button onClick={onNext}>Inizia</Button>
    </Box>
  );
};

export default StepIntroduction;

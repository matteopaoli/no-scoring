import { IconButton, Box } from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { Widget } from "@typeform/embed-react";

const HelpButton: React.FC = () => {
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);

  const toggleWidget = () => {
    setIsWidgetVisible((prev) => !prev);
  };

  return (
    <>
      {/* Fixed Button for Typeform Widget */}
      <IconButton
        position="fixed"
        bottom={{ base: "20px", sm: "30px", lg: "50px" }}
        right={{ base: "20px", sm: "30px", lg: "50px" }}
        icon={<QuestionOutlineIcon boxSize={8} />}
        colorScheme="brand"
        onClick={toggleWidget}
        zIndex="10"
        borderRadius="full"
        fontSize="xl"
        aria-label="Help"
        size="lg"
      />

      {/* Typeform Widget */}
      {isWidgetVisible && (
        <Box
        position="fixed"
        bottom={{ base: '80px', sm: '100px' }}
        left={{ base: '20px', md: 'unset' }}
        right={{ base: 'unset', md: '20px' }}
        width="calc(100% - 40px)"
        maxWidth="600px"
        zIndex="10"
        transition="all 0.3s ease"
      >
        <Widget
          id="sm6WDLIR"
          style={{ width: '100%', height: '500px' }} // Adjust the widget's height
        />
      </Box>
      )}
    </>
  );
};

export default HelpButton;

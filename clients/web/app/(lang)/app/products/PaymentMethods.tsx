import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Image,
  Spinner,
  Text,
  Tooltip,
  useClipboard,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import CopyTextBox from '@/app/components/copyTextBox/CopyTextBox';

interface PaymentMethodsProps {
  imageData: {
    qrcode?: string; // Optional base64 string for QR code
    priceTag?: string; // Optional base64 string for price tag
  };
  paymentLink: string; // Payment link
  productId: string;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ imageData, paymentLink, productId }) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [priceTag, setPriceTag] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (imageData.qrcode) setQrCode(imageData.qrcode);
    if (imageData.priceTag) setPriceTag(imageData.priceTag);
  }, [imageData]);

  // Clipboard functionality for copying the payment link
  const { hasCopied, onCopy } = useClipboard(paymentLink);

  // Define color modes
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const bgBox = useColorModeValue('white', 'whiteAlpha.100');
  const bgButton = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const bgButtonHover = useColorModeValue('secondaryGray.400', 'whiteAlpha.50');

  // Helper function to download base64 image
  const downloadBase64Image = (base64Data: string, filename: string) => {
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = filename;
    link.click();
  };

  return (
    <VStack spacing={4} width="full">
      <Box
        borderColor={borderColor}
        borderRadius="md"
        backgroundColor={bgBox}
        width="100%"
        p="20px"
      >
        <Text fontWeight="bold">Link di Pagamento</Text>
        <CopyTextBox>{paymentLink}</CopyTextBox>
        
        <Box display="flex" flexDirection="column" width="full" mt={4}>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <Text fontWeight="bold">QR Code e Etichetta</Text>
              <Flex justify="space-between" align="flex-start" mt={2}>
                {/* QR Code Section */}
                <Box height="200px" display="flex" flexDirection="column" alignItems="center" width="50%">
                  {qrCode ? (
                    <>
                      <Image src={qrCode} alt="QR Code" boxSize="100px" objectFit="contain" />
                      <Button
                        mt={2}
                        onClick={() => downloadBase64Image(qrCode, 'qrcode.png')}
                        backgroundColor={bgButton}
                        _hover={{ bg: bgButtonHover }}
                      >
                        Scarica QR Code
                      </Button>
                    </>
                  ) : (
                    <Image src="/img/image-not-available.jpg" width={150} />
                  )}
                </Box>
                
                {/* Price Tag Section */}
                <Box height="200px" display="flex" flexDirection="column" alignItems="center" width="50%">
                  {priceTag ? (
                    <>
                      <Image src={`data:image/png;base64,${priceTag}`} alt="Price Tag" boxSize="100px" objectFit="contain" />
                      <Button
                        mt={2}
                        onClick={() => downloadBase64Image(`data:image/png;base64,${priceTag}`, 'pricetag.png')}
                        backgroundColor={bgButton}
                        _hover={{ bg: bgButtonHover }}
                      >
                        Scarica Etichetta
                      </Button>
                    </>
                  ) : (
                    <Image src="/img/image-not-available.jpg" width={150} />
                  )}
                </Box>
              </Flex>
            </>
          )}
        </Box>
      </Box>
    </VStack>
  );
};

export default PaymentMethods;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Image,
  Link,
  Spinner,
  Text,
  Tooltip,
  useClipboard,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';

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

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products/payment-methods', { method: 'POST', body: JSON.stringify({ productId }) }); // Replace with your actual API endpoint
      const data = await response.json();
      setQrCode(data.qrCode);
      setPriceTag(data.priceTag);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

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
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        padding="4"
        backgroundColor={bgBox}
        width="100%"
      >
        <Text fontWeight="bold">Link di Pagamento</Text>
        <Tooltip label={hasCopied ? 'Copied!' : 'Click to copy'} aria-label="A tooltip">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            cursor="pointer"
            onClick={onCopy}
            padding="4"
            width="full"
            borderRadius="md"
            _hover={{ bg: bgButtonHover }}
          >
            <span style={{ color: textColor }}>{paymentLink}</span>
            <Button
              size="sm"
              onClick={onCopy}
              backgroundColor={bgButton}
              _hover={{ bg: bgButtonHover }}
            >
              Copy
            </Button>
          </Box>
        </Tooltip>
        
        <Box display="flex" flexDirection="column" width="full" mt={4}>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <Text fontWeight="bold">QR Code</Text>
              <Box height="200px" width="full" display="flex" alignItems="center">
                {qrCode ? (
                  <Flex w="100%" alignItems="center" justifyContent="space-between">
                    <Image src={qrCode} alt="QR Code" boxSize="100px" objectFit="contain" />
                    <Button
                      mt={2}
                      onClick={() => downloadBase64Image(qrCode, 'qrcode.png')}
                      backgroundColor={bgButton}
                      _hover={{ bg: bgButtonHover }}
                    >
                      Scarica QR Code
                    </Button>
                  </Flex>
                ) : (
                  <Image src="/img/image-not-available.jpg" width={150} />
                )}
              </Box>
              
              <Text fontWeight="bold">Etichetta</Text>
              <Box height="200px" width="full" display="flex" alignItems="center" mt={2}>
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
            </>
          )}
        </Box>

        <Button onClick={fetchImages} isLoading={loading} mt={4}>
          Genera metodi di pagamento
        </Button>
      </Box>
    </VStack>
  );
};

export default PaymentMethods;

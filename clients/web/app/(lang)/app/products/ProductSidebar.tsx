import { useEffect, useState, Suspense, useTransition } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Spinner,
  Flex,
  Box,
  Text,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import PaymentMethods from './PaymentMethods';
import { useRouter } from 'next/navigation';

type ProductSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  btnRef?: React.RefObject<HTMLTableRowElement | null>;
  productId: string | null;
};

// Function to fetch product data
const fetchProductData = async (productId: string) => {
  const response = await fetch(`/api/products?productId=${productId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export default function ProductSidebar({ isOpen, onClose, btnRef, productId }: ProductSidebarProps) {
  const [product, setProduct] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const bgBox = useColorModeValue('white', 'whiteAlpha.100');
  let [isPending, startTransition] = useTransition()
  const router = useRouter();

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const data = await fetchProductData(productId);
          setProduct(data);
        } catch (error) {
          console.error('Failed to fetch product:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [productId]);

  const handleDelete = async () => {
    await fetch(`/api/products/remove?productId=${productId}`, { method: 'DELETE' })
    setShowDeleteConfirmation(false); // Hide confirmation after delete
    onClose(); // Close the drawer after deletion
    location.reload()
  };

  const toggleDeleteConfirmation = () => {
    setShowDeleteConfirmation(!showDeleteConfirmation);
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={btnRef}
      size="lg"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Dettagli Prodotto</DrawerHeader>

        <DrawerBody>
          {loading ? (
            <Flex justify="center" align="center" height="100%">
              <Spinner size="xl" />
            </Flex>
          ) : (
            <Suspense fallback={<Spinner size="xl" />}>
              <PaymentMethods 
                productId={productId!} 
                paymentLink={product?.paymentLink?.url} 
                imageData={{ qrcode: product?.qrcode, priceTag: product?.tagImage }} 
              />
            </Suspense>
          )}
        </DrawerBody>

        <DrawerFooter>
          <Flex justifyContent="space-between" w="100%" position="relative">
            {showDeleteConfirmation && (
              <Box
                position="absolute"
                bottom="60px" // Moves the box above the delete button
                left="0"
                right="0"
                mx="auto"
                p={3}
                bg={bgBox}
                borderRadius="md"
                boxShadow="md"
                border="1px solid"
                borderColor="gray.200"
                width="240px" // Set a small width for the confirmation box
                zIndex="10"
              >
                <Text fontSize="md" mb={4} textAlign="center" textColor={textColor}>
                  Sei sicuro di voler eliminare?
                </Text>
                <Stack direction="row" justify="space-between">
                  <Button size="sm" colorScheme="red" onClick={handleDelete}>
                    Elimina
                  </Button>
                  <Button size="sm" variant="outline" onClick={toggleDeleteConfirmation}>
                    Annulla
                  </Button>
                </Stack>
              </Box>
            )}

            <Button colorScheme="red" onClick={toggleDeleteConfirmation}>
              Elimina
            </Button>
            {/* <Button colorScheme="blue" onClick={() => router.push(`/app/products/edit/${productId}`)}>
              Modifica
            </Button> */}
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

import { useEffect, useState, Suspense, lazy } from 'react';
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
} from '@chakra-ui/react';
import PaymentMethods from './PaymentMethods';

type ProductSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  btnRef?: React.RefObject<HTMLTableRowElement>;
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

  return (
    <Drawer
      isOpen={isOpen}
      placement='right'
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
            <Flex
              justify="center"
              align="center"
              height="100%"
            >
              <Spinner size="xl" />
            </Flex>
          ) : (
            <Suspense fallback={
              <Flex justify="center" align="center" height="100%">
                <Spinner size="xl" />
              </Flex>
            }>
              <PaymentMethods 
                productId={productId!} 
                paymentLink={product?.paymentLink?.url} 
                imageData={{ qrcode: product?.qrcode, priceTag: product?.tagImage }} 
              />
            </Suspense>
          )}
        </DrawerBody>

        <DrawerFooter>
          <Button variant='outline' mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme='blue'>Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

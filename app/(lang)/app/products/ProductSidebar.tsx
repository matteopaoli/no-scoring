import { useEffect, useState, Suspense } from 'react';
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
import { useRouter } from 'next/navigation';

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
  const router = useRouter()

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

  const handleEdit = () => {
    // Implement edit functionality here
    console.log("Edit product", productId);
  };

  const handleDelete = () => {
    // Implement delete functionality here
    console.log("Delete product", productId);
  };

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
          <Flex justifyContent="space-between" w="100%">
            <Button colorScheme='red' onClick={handleDelete}>
              Elimina
            </Button>
            <Button colorScheme='blue' onClick={() => router.push(`/app/products/edit/${[productId]}`)}>
              Modifica
            </Button>
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

import CopyTextBox from '@/app/components/copyTextBox/CopyTextBox'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Button,
} from '@chakra-ui/react'
import { RefObject, useEffect, useState } from 'react'
import ImageDisplay from './PaymentMethods'
import PaymentMethods from './PaymentMethods'

type ProductSidebarProps = {
  isOpen: boolean
  onClose: () => void
  btnRef?: RefObject<HTMLTableRowElement>
  productId: string | null
}

export default function ProductSidebar({ isOpen, onClose, btnRef, productId }: ProductSidebarProps) {
  const [product, setProduct] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        const response = await fetch(`/api/products?productId=${productId}`)
        return await response.json()
      }
      fetchProduct().then((data) => {
        setProduct(data)
      })
    }
  }, [productId])

  console.log(product)

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
        <PaymentMethods productId={productId!} paymentLink={product?.paymentLink?.url} imageData={{ qrcode: product?.qrcode, priceTag: product?.tagImage }} />
      </DrawerBody>

      <DrawerFooter>
        <Button variant='outline' mr={3} onClick={onClose}>
          Cancel
        </Button>
        <Button colorScheme='blue'>Save</Button>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
  )
}
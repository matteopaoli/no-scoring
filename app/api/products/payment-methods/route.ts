import { auth } from "@/app/auth"
import { getUser, getUserById, updateProduct } from "@/app/db"
import { generateQrCodeWithLogo } from "@/app/utils/images"
import { createPaymentLink, getPaymentLinkUrl } from "@/app/utils/stripe"
import Stripe from "stripe"

export async function POST(request: Request) {
  const { productId } = await request.json()

  const session = await auth()
  console.log(session)
  const user = await getUser(session?.user?.email!)
  const stripe = new Stripe(user.stripeSecretKey)
  const paymentLinkId = await createPaymentLink(stripe, productId)
  const paymentLinkUrl = await getPaymentLinkUrl(stripe, paymentLinkId)
  const qrcode = await generateQrCodeWithLogo(paymentLinkUrl)
  await updateProduct(productId, paymentLinkId, qrcode, '')
  return Response.json({ paymentLinkUrl }, { status: 200 })
}
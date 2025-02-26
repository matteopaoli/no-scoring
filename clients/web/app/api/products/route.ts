import { auth } from "@/app/auth";
import { getProduct } from "@/app/db";
import { UserService } from "@/app/services/userService";
import { NextRequest } from "next/server";
import Stripe from "stripe";

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 })
  }
  const user = await UserService.getUserByEmail(session.user.email)
  const stripe = new Stripe(process.env.STRIPE_API_KEY!, { stripeAccount: user.stripeUserId });
  const searchParams = request.nextUrl.searchParams
  const productId = searchParams.get('productId')
  if (!productId) {
    return new Response('Error', { status: 400 })
  }
  const product = await getProduct(productId)
  if (product.paymentLinkId) {
    const paymentLink = await stripe.paymentLinks.retrieve(product.paymentLinkId)
    return Response.json({ ...product, paymentLink }, { status: 200 })
  }
  
  return Response.json(product, { status: 200 })
}
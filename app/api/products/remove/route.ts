import { auth } from "@/app/auth";
import { getUser } from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function DELETE(request: NextRequest) {
  const session = await auth();
  const searchParams = request.nextUrl.searchParams;
  const productId = searchParams.get('productId');

  // Validate session and productId
  if (!session?.user?.email || !productId) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const user = await getUser(session.user.email);
  const stripe = new Stripe(process.env.STRIPE_API_KEY!, { stripeAccount: user.stripeUserId });

  try {
    // Update the product to archive it
    const updatedProduct = await stripe.products.update(productId, {
      active: false, // Set the product to inactive
    });

    return NextResponse.json({ message: 'Product archived successfully', product: updatedProduct });
  } catch (error: any) {
    console.error('Error archiving product:', error);
    return NextResponse.json({ error: 'Failed to archive product', details: error.message }, { status: 500 });
  }
}

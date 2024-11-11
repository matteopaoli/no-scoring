import { NextApiRequest, NextApiResponse } from "next";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY!);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const accountId = searchParams.get("accountId");
  if (!accountId) {
    throw new Error("No account id param");
  }
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.BASE_URL}/api/stripe/refresh-url?accountId=${accountId}`,
    return_url: `${process.env.BASE_URL}/login`,
    type: "account_onboarding",
  });

  redirect(accountLink.url);
}

import { redirect } from "next/navigation";
import ForgotPasswordClientPage from "./page.client";
import DefaultAuth from "@/app/layouts/admin/Auth";
import { Box, Heading } from "@chakra-ui/react";
import ForgotPasswordExpired from "./expired";

export default async function ResetPasswordPage(
  props: {
    searchParams?: Promise<{ [key: string]: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const token = searchParams?.token;
  if (!token) {
    throw new Error("Missing token");
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-reset-token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    }
  );
  const data = await response.json();
  console.log(data);
  if (data.valid) {
    return <ForgotPasswordClientPage />;
  }
  return <ForgotPasswordExpired />;
}

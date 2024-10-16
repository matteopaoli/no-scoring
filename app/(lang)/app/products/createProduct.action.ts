"use server";

import { auth } from "@/app/auth";
import { createProduct, getUser } from "@/app/db";
import Stripe from "stripe";
import { z } from "zod";
import { createPaymentLink } from "@/app/utils/stripe";
import { generateQrCodeWithLogo, generateTagImage } from "@/app/utils/images";
import { redirect } from "next/navigation";
import { uploadImageToS3 } from "@/app/utils/s3";
import formatZodErrors from "@/app/utils/formatZodErrors";
import { FormActionReturnType } from "@/app/types";

export default async function createProductAction(
  prevState,
  formData: FormData
): FormActionReturnType {
  const MAX_FILE_SIZE = 5000000;
  const session = await auth();
  const user = await getUser(session?.user?.email);
  if (!user) {
    throw new Error("User not found");
  }

  const stripe = new Stripe(user.stripeSecretKey);

  // Validation schema for product data
  const createProductSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.preprocess(
      (val) => {
        // Replace the comma with a dot before parsing
        const priceString = (val as string).replace(",", ".");
        return parseFloat(priceString);
      },
      z.number().positive("Price must be a positive number")
    ),
    image: z.instanceof(File).optional().refine((file) => file?.size ?? 0 <= MAX_FILE_SIZE, `L'immagine non puó superare i 5MB.`), // Optional product image
    includeCommission: z.string().nullable().optional(), // Checkbox for including commission
  });

  const validation = createProductSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    image: formData.get("image"),
    includeCommission: formData.get("includeCommission"), // Capture the checkbox value
  });

  if (!validation.success) {
    return formatZodErrors(validation);
  }

  const { name, description, price, image, includeCommission } = validation.data;

  let imageUrl: string | null = null;

  // Upload the image to S3 if provided
  if (image) {
    imageUrl = await uploadImageToS3(image);
    if (!imageUrl) {
      throw new Error("Failed to upload image to S3");
    }
  }

  // Modify the description if the checkbox is checked
  let finalDescription = description || "";
  if (includeCommission) {
    finalDescription += "\n\nIl prezzo è stato aumentato per includere le commissioni associate al pagamento in più rate.";
  }

  // Create the product in Stripe
  const product = await stripe.products.create({
    name,
    description: finalDescription, // Use the updated description
    images: imageUrl ? [imageUrl] : [],
    default_price_data: {
      currency: "eur",
      unit_amount: Math.round(price * 100),
    },
  });

  const paymentLink = await createPaymentLink(stripe, product.id);
  const qrcode = await generateQrCodeWithLogo(paymentLink.url);
  const tagImage = await generateTagImage(qrcode, name, price);

  await createProduct({
    id: product.id,
    paymentLinkId: paymentLink.id,
    qrcode,
    tagImage,
    userId: user.id
  });

  redirect("/app/products?success=true&action=createProduct");
}

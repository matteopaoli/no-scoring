"use server";

import { auth } from "@/app/auth";
import { createProduct, getUser } from "@/app/db";
import Stripe from "stripe";
import { z } from "zod";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid"; // To generate unique file names
import { createPaymentLink } from "@/app/utils/stripe";
import { generateQrCodeWithLogo, generateTagImage } from "@/app/utils/images";

// Initialize S3 client (assuming the region and credentials are set up in your environment)
const s3 = new S3Client();

export default async function createProductAction(prevState, formData: FormData): Promise<string> {
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
      (val) => parseFloat(val as string),
      z.number().positive("Price must be a positive number")
    ),
    image: z.instanceof(File).optional(), // Optional product image
  });

  const validation = createProductSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    image: formData.get("image"),
  });

  if (!validation.success) {
    return JSON.stringify(validation.error);
  }

  const { name, description, price, image } = validation.data;

  let imageUrl: string | null = null;

  // Upload the image to S3 if provided
  if (image) {
    imageUrl = await uploadImageToS3(image);
    if (!imageUrl) {
      throw new Error("Failed to upload image to S3");
    }
  }

  // Create the product in Stripe
  const product = await stripe.products.create({
    name,
    description,
    images: imageUrl ? [imageUrl] : [],
  });

  // Create the price for the product
  const priceData = await stripe.prices.create({
    unit_amount: Math.round(price * 100), // Stripe requires price in cents
    currency: "eur", // Adjust the currency if necessary
    product: product.id,
  });

  const paymentLink = await createPaymentLink(stripe, product.id)
  const qrcode = await generateQrCodeWithLogo(paymentLink.url)
  const tagImage = await generateTagImage(qrcode)

  await createProduct({ id: product.id, paymentLinkId: paymentLink.id, qrcode })

  return JSON.stringify({ product, price: priceData });
}

// Upload the image to S3 and return the public URL
async function uploadImageToS3(file: File): Promise<string> {
  const imageBuffer = await file.arrayBuffer();
  const imageKey = `${uuidv4()}-${file.name}`; // Generate a unique filename

  const params = {
    Bucket: "paytomorrow", // Replace with your S3 bucket name
    Key: imageKey,
    Body: Buffer.from(imageBuffer),
    ContentType: file.type, // Set the content type (image/jpeg, image/png, etc.)
  };

  // Upload the image to S3
  const command = new PutObjectCommand(params);
  await s3.send(command);

  // Return the public URL for the uploaded image
  return `https://${params.Bucket}.s3.amazonaws.com/${imageKey}`;
}

"use server";

import { getProduct } from "@/app/db";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import { uploadImageToS3 } from "@/app/utils/s3";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { z } from "zod";

export default async function updateProductAction(prevState, formData: FormData): Promise<string> {
  const user = await getUserFromAuth();
  if (!user) {
    throw new Error("User not found");
  }

  const stripe = new Stripe(process.env.STRIPE_API_KEY!, { stripeAccount: user.stripeUserId });

  // Validation schema for product update data
  const updateProductSchema = z.object({
    id: z.string().min(1, "Product id is required"),
    name: z.string().min(1, "Name is required").optional(),
    description: z.string().optional(),
    price: z.preprocess(
      (val) => parseFloat(val as string),
      z.number().positive("Price must be a positive number")
    ),
    image: z.instanceof(File).optional(), // Optional product image
  });

  const validation = updateProductSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    image: formData.get("image"),
  });

  if (!validation.success) {
    return JSON.stringify(validation.error);
  }

  const { id, name, description, price, image } = validation.data;

  // Retrieve the existing product from Stripe
  const product = await stripe.products.retrieve(id);
  if (!product) {
    throw new Error("Product not found");
  }

  // Prepare to update product details
  const updateData: any = {};
  if (name) updateData.name = name;
  if (description) updateData.description = description;

  // Update the product in Stripe
  await stripe.products.update(id, updateData);

  // Retrieve existing price data from Stripe
  const currentPriceId = product.default_price as string;
  const currentPrice = await stripe.prices.retrieve(currentPriceId);

  // Compare the provided price with the current price
  if (price && currentPrice.unit_amount !== Math.round(price * 100)) {
    // Create a new price if the price has changed
    const newPrice = await stripe.prices.create({
      unit_amount: Math.round(price * 100), // Stripe requires the price in cents
      currency: "eur", // Adjust the currency if necessary
      product: id, // Associate this new price with the product
    });

    // Set the new price as the default price for the product
    await stripe.products.update(id, {
      default_price: newPrice.id,
    });

    // Retrieve product information from your database
    const dbProduct = await getProduct(id);

    // Update the payment link with the new price
    if (dbProduct.paymentLinkId) {
      await stripe.paymentLinks.update(dbProduct.paymentLinkId, {
        line_items: [
          {
            
          },
        ],
      });
    }
  }

  let imageUrl: string | null = null;

  // Upload the new image to S3 if provided
  if (image) {
    imageUrl = await uploadImageToS3(image);
    if (!imageUrl) {
      throw new Error("Failed to upload image to S3");
    }

    // Update product images in Stripe if a new image URL is provided
    await stripe.products.update(id, {
      images: imageUrl ? [imageUrl] : [],
    });
  }

  // Redirect to the product list after a successful update
  redirect('/app/products?success=true&action=edit');
}

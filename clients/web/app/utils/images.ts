import QRCode from "qrcode";
import sharp from "sharp";
import { createCanvas, loadImage, registerFont } from "canvas";
import { promisify } from "node:util";
import fs from "node:fs";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";

// Promisified file operations
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

export async function imageToBase64(image: Blob) {
  const buffer = await image.arrayBuffer();
  const base64Image = Buffer.from(buffer).toString("base64");
  return `data:image/jpeg;base64,${base64Image}`;
}

export async function compressProfileImageToBase64(
  image: Blob
): Promise<string> {
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const resizedBuffer = await sharp(buffer)
    .resize(512, 512, {
      fit: "cover",
      position: "center",
    })
    .jpeg({ quality: 80 })
    .toBuffer();

  return `data:image/jpeg;base64,${resizedBuffer.toString("base64")}`;
}

export async function generateQrCodeWithLogo(
  paymentLinkUrl: string
): Promise<string> {
  try {
    // Step 1: Generate the QR code as a buffer (PNG format)
    const qrCodeBuffer = await QRCode.toBuffer(paymentLinkUrl, {
      errorCorrectionLevel: "H", // High error correction to account for the logo
      type: "png",
      width: 500, // Adjust the size as needed
      margin: 2,
    });

    // Step 2: Get the logo and resize it (e.g., 20% of the QR code size)
    const logo = await sharp("./logo.jpg")
      .resize({ width: 150, height: 150 }) // Resize the logo to 150x150
      .toBuffer();

    // Step 3: Create a rounded-corner mask using an SVG
    const roundedCornerMask = Buffer.from(
      `<svg width="150" height="150">
         <rect x="0" y="0" width="150" height="150" rx="30" ry="30" />
       </svg>`
    );

    // Step 4: Apply the rounded-corner mask to the logo
    const roundedLogo = await sharp(logo)
      .composite([{ input: roundedCornerMask, blend: "dest-in" }]) // Apply rounded corners
      .png() // Output as PNG
      .toBuffer();

    // Step 5: Composite (overlay) the rounded logo on the QR code
    const qrWithLogoBuffer = await sharp(qrCodeBuffer)
      .composite([{ input: roundedLogo, gravity: "center" }]) // Center the logo on the QR code
      .toBuffer();

    // Step 6: Convert the buffer to a base64 string
    const qrWithLogoBase64 = qrWithLogoBuffer.toString("base64");

    // Return the base64 string in the format usable in an <img> tag
    return `data:image/png;base64,${qrWithLogoBase64}`;
  } catch (error) {
    console.error("Error generating QR code with logo:", error);
    throw new Error("Failed to generate QR code with logo");
  }
}

export const generateTagImage = async (
  base64Image: string,
  productName: string,
  productPrice: number,
  productImage?: string | null
): Promise<string> => {
  const template = await sharp("./tag-template.png").toBuffer();

  const canvas = createCanvas(600, 1050);
  const ctx = canvas.getContext("2d");
  const img = await loadImage(template);
  ctx.drawImage(img, 0, 0);

  ctx.font = "bold 40px Poppins";
  ctx.fillStyle = "#EB841E";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const fullProductText = `${productName.toUpperCase()} €${productPrice}`;
  const maxWidth = 500;
  const x = canvas.width / 2;
  const y = 470;

  const wrapText = (
    context: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(" ");
    let line = "";
    let yPosition = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {
        context.fillText(line, x, yPosition);
        line = words[i] + " ";
        yPosition += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, yPosition);
  };

  wrapText(ctx, fullProductText, x, y, maxWidth, 50);

  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  const imgBuffer = Buffer.from(base64Data, "base64");

  const uniqueFilename = `overlayImage-${uuidv4()}.png`;
  const tempFilePath = `./tmp/${uniqueFilename}`;
  await writeFile(tempFilePath, imgBuffer);

  const overlayImage = await loadImage(tempFilePath);
  ctx.drawImage(overlayImage, 300, 750, 200, 200);

  await unlink(tempFilePath);

  if (productImage) {
    try {
      const response = await fetch(productImage);
      const imageBuffer = await response.arrayBuffer();
      const productImageObj = await loadImage(Buffer.from(imageBuffer));
  
      const maxWidth = 300;
      const maxHeight = 300;
  
      const aspectRatio = productImageObj.width / productImageObj.height;
  
      let drawWidth = maxWidth;
      let drawHeight = maxWidth / aspectRatio;
  
      if (drawHeight > maxHeight) {
        drawHeight = maxHeight;
        drawWidth = maxHeight * aspectRatio;
      }
  
      const x = (canvas.width - drawWidth) / 2;
      const y = 150;
  
      ctx.drawImage(productImageObj, x, y, drawWidth, drawHeight);
    } catch (error) {
      console.error("Error loading product image:", error);
    }
  }

  const buffer = canvas.toBuffer("image/png");

  return buffer.toString("base64");
};

import QRCode from "qrcode";
import sharp from "sharp";
import { createCanvas, loadImage } from "canvas";
import { promisify } from "node:util";
import fs from 'node:fs'
import path from "node:path";
import { v4 as uuidv4 } from 'uuid';

// Promisified file operations
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

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
  productName: string
): Promise<string> => {
    // Load template image
    const template = await sharp('./tag-template.png')
      .toBuffer();

    // Create a canvas with the size of the template image
    const canvas = createCanvas(600, 1050);
    const ctx = canvas.getContext("2d");

    // Load the template image into the canvas
    const img = await loadImage(template);
    ctx.drawImage(img, 0, 0);

    // Add text to the image
    ctx.font = "40px Arial"; // Customize the font and size
    ctx.fillStyle = "white"; // Customize the color
    ctx.fillText(productName, 100, 100); // Adjust text position (x, y)

    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

    // Convert base64 to image and write it to a unique tmp file
    const imgBuffer = Buffer.from(base64Data, "base64");
    
    // Create a unique file name using uuid
    const uniqueFilename = `overlayImage-${uuidv4()}.png`;
    const tempFilePath = `./tmp/${uniqueFilename}`
    await writeFile(tempFilePath, imgBuffer);

    // Load the image from the temp file
    const overlayImage = await loadImage(tempFilePath);
    ctx.drawImage(overlayImage, 300, 200, 200, 200); // Adjust the image size and position

    // Remove the temporary file after use
    await unlink(tempFilePath);

    // Get the final image buffer as PNG
    const buffer = canvas.toBuffer("image/png");

    // Convert buffer to base64 and return
    return buffer.toString('base64');
};
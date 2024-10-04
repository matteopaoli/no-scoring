import QRCode from "qrcode";
import sharp from "sharp";
import { createCanvas, loadImage, registerFont } from "canvas";
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
  productName: string,
  productPrice: number
): Promise<string> => {
    // Load template image
    const template = await sharp('./tag-template.png').toBuffer();

    // Create a canvas with the size of the template image
    const canvas = createCanvas(600, 1050);
    const ctx = canvas.getContext("2d");

    // Load the template image into the canvas
    const img = await loadImage(template);
    ctx.drawImage(img, 0, 0);

    // Set font style for the product name (Poppins, Bold)
    ctx.font = "bold 40px Poppins"; // Use Poppins font with bold style
    ctx.fillStyle = "#EB841E"; // Set text color to #EB841E (orange)
    ctx.textAlign = "center"; // Center align the text horizontally
    ctx.textBaseline = "middle"; // Vertically center the text

    // Convert product name to uppercase and concatenate product price
    const fullProductText = `${productName.toUpperCase()} €${productPrice}`;

    // Calculate the maximum width to prevent text overflow
    const maxWidth = 500; // Set a maximum width for the text
    const x = canvas.width / 2; // X-coordinate for centered text
    const y = 400; // Y-coordinate for the text (adjusted to 400)

    // Function to wrap text if it exceeds the maxWidth
    const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        const words = text.split(' ');
        let line = '';
        let yPosition = y;

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;

            if (testWidth > maxWidth && i > 0) {
                context.fillText(line, x, yPosition);
                line = words[i] + ' ';
                yPosition += lineHeight;
            } else {
                line = testLine;
            }
        }
        context.fillText(line, x, yPosition);
    };

    // Add the full product text (name + price) to the image, wrapping it if needed
    wrapText(ctx, fullProductText, x, y, maxWidth, 50);

    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const imgBuffer = Buffer.from(base64Data, "base64");

    // Create a unique file name for the temporary image
    const uniqueFilename = `overlayImage-${uuidv4()}.png`;
    const tempFilePath = `./tmp/${uniqueFilename}`;
    await writeFile(tempFilePath, imgBuffer);

    // Load the overlay image (base64 image provided by the user)
    const overlayImage = await loadImage(tempFilePath);
    ctx.drawImage(overlayImage, 300, 750, 200, 200); // Adjust the image size and position (Y = 750)

    // Remove the temporary file after use
    await unlink(tempFilePath);

    // Get the final image buffer as PNG
    const buffer = canvas.toBuffer("image/png");

    // Convert buffer to base64 and return
    return buffer.toString('base64');
};
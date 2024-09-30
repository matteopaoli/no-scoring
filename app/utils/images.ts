import QRCode from 'qrcode';
import sharp from 'sharp';

export async function generateQrCodeWithLogo(paymentLinkUrl: string): Promise<string> {
  try {
    // Step 1: Generate the QR code as a buffer (PNG format)
    const qrCodeBuffer = await QRCode.toBuffer(paymentLinkUrl, {
      errorCorrectionLevel: 'H', // High error correction to account for the logo
      type: 'png',
      width: 500, // Adjust the size as needed
      margin: 2
    });

    // Step 2: Get the logo and resize it (e.g., 20% of the QR code size)
    const logo = await sharp('./logo.jpg')
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
      .composite([{ input: roundedCornerMask, blend: 'dest-in' }]) // Apply rounded corners
      .png() // Output as PNG
      .toBuffer();

    // Step 5: Composite (overlay) the rounded logo on the QR code
    const qrWithLogoBuffer = await sharp(qrCodeBuffer)
      .composite([{ input: roundedLogo, gravity: 'center' }]) // Center the logo on the QR code
      .toBuffer();

    // Step 6: Convert the buffer to a base64 string
    const qrWithLogoBase64 = qrWithLogoBuffer.toString('base64');
    
    // Return the base64 string in the format usable in an <img> tag
    return `data:image/png;base64,${qrWithLogoBase64}`;
  } catch (error) {
    console.error('Error generating QR code with logo:', error);
    throw new Error('Failed to generate QR code with logo');
  }
}

export async function generateTagImage(qrCode: string): Promise<string> {
   
}

import QRCode from 'qrcode';
import sharp from 'sharp';
import gm from 'gm';

function base64ToBuffer(base64Image: string) {
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
  return Buffer.from(base64Data, 'base64');
}

const imageFileToBase64 = async (filePath: string): Promise<string> => {
  const imageBuffer = await sharp(filePath).toBuffer();
  return `data:image/png;base64,${imageBuffer.toString('base64')}`;
};

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

export const generateTagImage = async (
  base64Image: string,
): Promise<string> => {
  const templatePath = './tagTemplate.png'
  // Convert base64 image to a buffer
  const overlayImageBuffer = base64ToBuffer(base64Image);

  // Use sharp to convert base64 image to buffer without saving to file
  const overlayImage = await sharp(overlayImageBuffer).toBuffer();

  // Define positions for the base64 image and text
  const imagePosition = { x: 100, y: 50 }; // Adjust as needed
  const textPosition = { x: 200, y: 300 }; // Adjust as needed

  // Stream the base64 image as input to gm
  const overlayStream = new PassThrough();
  overlayStream.end(overlayImage); // Send sharp buffer through stream

  return new Promise((resolve, reject) => {
    gm(templatePath)
      // Overlay the image from buffer
      .composite(overlayStream) // Use stream as input
      .geometry(`+${imagePosition.x}+${imagePosition.y}`) // Position for the overlay image
      // Add text
      .font('Arial')
      .fontSize(40)
      .fill('white')
      .drawText(textPosition.x, textPosition.y, 'Hello World!')
      // Get the image as a buffer
      .toBuffer('PNG', (err, buffer) => {
        if (err) {
          reject('Error processing image: ' + err);
          return;
        }
        // Convert the final image buffer to base64
        const base64Result = bufferToBase64(buffer);
        resolve(base64Result);
      });
  });
};
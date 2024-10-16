import { generateQrCodeWithLogo, generateTagImage, generateGenericProductImages } from './app/utils/images';
import fs from 'node:fs/promises';

const runTest = async () => {
  try {
    // Test generating a QR code with a logo
    const qrCodeBase64 = await generateQrCodeWithLogo('https://example.com');
    console.log("Generated QR Code with Logo");

    // Save the QR code image to a file
    await fs.writeFile('./output/qrCodeWithLogo.png', qrCodeBase64.replace(/^data:image\/png;base64,/, ''), 'base64');

    // Save the QR code Base64 string to a text file
    await fs.writeFile('./output/qrCodeWithLogo.txt', qrCodeBase64);

    // Dummy base64 image for user logo (Replace this with an actual base64-encoded image string for testing)
    const base64UserLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."; // Truncated for brevity

    // Test generating generic product images with the QR code and user logo
    const { genericProductSmallImage, genericProductLargeImage } = await generateGenericProductImages(qrCodeBase64, base64UserLogo);
    console.log("Generated Generic Product Images with User Logo");

    // Save the generic small product image to a file
    await fs.writeFile('./output/genericProductSmallImage.jpg', genericProductSmallImage.replace(/^data:image\/jpeg;base64,/, ''), 'base64');

    // Save the generic small product Base64 string to a text file
    await fs.writeFile('./output/genericProductSmallImage.txt', genericProductSmallImage);

    // Save the generic large product image to a file
    await fs.writeFile('./output/genericProductLargeImage.jpg', genericProductLargeImage.replace(/^data:image\/jpeg;base64,/, ''), 'base64');

    // Save the generic large product Base64 string to a text file
    await fs.writeFile('./output/genericProductLargeImage.txt', genericProductLargeImage);

  } catch (error) {
    console.error('Error during testing:', error);
  }
};

runTest();

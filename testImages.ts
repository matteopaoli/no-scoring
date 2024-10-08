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

    // Test generating a tag image
    const tagImageBase64 = await generateTagImage(qrCodeBase64, 'Sample Product', 19.99);
    console.log("Generated Tag Image");

    // Save the tag image to a file
    await fs.writeFile('./output/tagImage.png', tagImageBase64.replace(/^data:image\/png;base64,/, ''), 'base64');

    // Save the tag image Base64 string to a text file
    await fs.writeFile('./output/tagImage.txt', tagImageBase64);

    // Test generating generic product images
    const { genericProductSmallImage, genericProductLargeImage } = await generateGenericProductImages(qrCodeBase64);
    console.log("Generated Generic Product Images");

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

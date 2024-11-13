import {
  generateQrCodeWithLogo,
  generateTagImage,
} from './app/utils/images';
import fs from 'node:fs/promises';

const runTest = async () => {
  try {
    // Test generating a QR code with a logo
    const qrCodeBase64 = await generateQrCodeWithLogo('https://example.com');
    console.log('Generated QR Code with Logo');

    // Save the QR code image to a file
    await fs.writeFile(
      './output/qrCodeWithLogo.png',
      qrCodeBase64.replace(/^data:image\/png;base64,/, ''),
      'base64'
    );

    // Save the QR code Base64 string to a text file
    await fs.writeFile('./output/qrCodeWithLogo.txt', qrCodeBase64);

    // Dummy base64 image for user logo (Replace this with an actual base64-encoded image string for testing)

    // Test generating a tag image
    const tagImageBase64 = await generateTagImage(
      qrCodeBase64,
      'Sample Product',
      19.99,
      'https://paytomorrow.s3.amazonaws.com/0e722425-2eab-46b3-8c8d-f943c2791057-AAAAA%20Un%20bel%20negozio-logo.jpg'
    );
    console.log('Generated Tag Image');

    // Save the tag image to a file
    await fs.writeFile(
      './output/tagImage.png',
      tagImageBase64.replace(/^data:image\/png;base64,/, ''),
      'base64'
    );

    // Save the tag image Base64 string to a text file
    await fs.writeFile('./output/tagImage.txt', tagImageBase64);
  } catch (error) {
    console.error('Error during testing:', error);
  }
};

runTest();

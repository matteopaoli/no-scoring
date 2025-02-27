import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid"; // To generate unique file names

const s3 = new S3Client();

export async function uploadImageToS3(file: File): Promise<string> {
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
  return encodeURI(`https://${params.Bucket}.s3.amazonaws.com/${imageKey}`);
}

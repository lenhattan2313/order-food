import envConfig from "@/config";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3Utils";
import { StatusCodes } from "http-status-codes";
//TODO create util func
async function uploadFileToS3(
  file: Buffer,
  fileName: string,
  category = "dish"
) {
  const params = {
    Bucket: envConfig.NEXT_AWS_S3_BUCKET_NAME,
    Key: `${category}/${fileName}`,
    Body: file,
    ContentType: "image/jpg",
  };
  console.log("file", fileName);
  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return fileName;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "File is required." },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = await uploadFileToS3(buffer, file.name);

    return NextResponse.json({
      data: fileName,
      message: "File uploaded successfully",
    });
  } catch (error) {
    return NextResponse.json({ error });
  }
}

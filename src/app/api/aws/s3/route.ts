import { uploadFileToS3 } from "@/lib/s3Utils";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

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

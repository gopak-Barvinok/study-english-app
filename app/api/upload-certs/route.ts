import "dotenv/config";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const scan = formData.get("scan") as File;
        const buffer = Buffer.from(await scan.arrayBuffer());

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: "certificates", resource_type: "auto" },
                (error, result) => error ? reject(error) : resolve(result)
            ).end(buffer)
        }) as any;
        return NextResponse.json({url: result.secure_url});
    } catch (e) {
        return NextResponse.json({error: e});
    }
}
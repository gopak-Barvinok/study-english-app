import { fetchGet } from "@/utils/utils";
import { NextRequest, NextResponse } from "next/server";
import "dotenv/config";
import { getUtcOffsets } from "@/scripts/server";

export async function GET(req: NextRequest) {
    const countryName = req.headers.get("X-Country") as string;
    try {
        const countriesList = await fetchGet('https://raw.githubusercontent.com/mledoze/countries/master/countries.json');
        const offsets = getUtcOffsets(countriesList, countryName);
        console.log(offsets);
        return NextResponse.json(offsets);
    } catch(e) {
        console.log(e);
        return NextResponse.json({status: 404});
    }
}
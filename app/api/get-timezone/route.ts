import { fetchGet } from "@/utils/utils";
import { NextRequest, NextResponse } from "next/server";
import "dotenv/config";

export async function GET(req: NextRequest) {
    const country = req.headers.get("X-Country");
    try {
        const countryCode = await fetchGet(`https://restcountries.com/v3.1/name/${country}`);
        const timezones = await fetchGet(
            `http://api.timezonedb.com/v2.1/list-time-zone?key=${process.env.TIMEZONE_KEY}&country=${countryCode[0].cca2}&format=json`,
        );
        return NextResponse.json({timezones});
    } catch(e) {
        return NextResponse.json({status: 404});
    }
}
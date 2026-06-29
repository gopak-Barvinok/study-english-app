import { NextResponse } from "next/server";

const COUNTRIES_URL = "https://raw.githubusercontent.com/mledoze/countries/master/countries.json";

export async function GET() {
    const res = await fetch(COUNTRIES_URL, { next: { revalidate: 86400 }});
    const countriesData = await res.json();
    const countriesList = countriesData
    .map((c: any) => { 
        return c.name.common;
    })
    .sort((a: string, b: string) => a.localeCompare(b));

    return NextResponse.json(countriesList);
}
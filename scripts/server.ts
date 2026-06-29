"server-only";

import ct from "countries-and-timezones";

export const getCca2 = (countriesList: any[], countryName: string) => {
    const suchCountry = countriesList.find((c: any) =>
        c.name.common.toLowerCase() === countryName!.toLowerCase()
    );
    const countryCca2 = suchCountry ? suchCountry.cca2 : null;
    console.log(countryCca2);
    return countryCca2;
}

export const getUtcOffsets = (countriesList: any[], countryName: string): string[] => {
    const cca2 = getCca2(countriesList, countryName);
    if (!cca2) return [];

    const country = ct.getCountry(cca2);
    if (!country) return [];

    const seen = new Set<string>();
    const offsets: string[] = [];

    for (const tzName of country.timezones) {
        const tz = ct.getTimezone(tzName);
        if (tz && !seen.has(tz.utcOffsetStr)) {
            seen.add(tz.utcOffsetStr);
            offsets.push(tz.utcOffsetStr);
        }
    }

    return offsets.sort();
}
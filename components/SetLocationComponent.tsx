import { fetchGet } from "@/utils/utils";
import { useEffect, useState } from "react";
import AsyncButton from "./buttons/AsyncBtn";
import { gmtOffsetToString } from "@/scripts/client";

type SetLocationComponentProps = {
  pageIsReady: () => Promise<void>;
  choosedCountry: string | null;
  toggleLocation: (location: string) => void;
  toggleTimezone: (timezoneOffset: string) => void;
};

export default function SetLocationComponent({
  pageIsReady,
  choosedCountry,
  toggleLocation,
  toggleTimezone,
}: SetLocationComponentProps) {
  const [countries, setCountries] = useState<string[]>();
  const [timezones, setTimezones] = useState<any[]>();

  useEffect(() => {
    let countriesList: string[] = [];
    fetchGet("https://restcountries.com/v3.1/all?fields=name").then((data) => {
      countriesList = data.map((c: any) => {
        return c.name.common;
      });
      countriesList.sort((a, b) => a.localeCompare(b));
      setCountries(countriesList);
    });
  }, []);

  useEffect(() => {
    if(choosedCountry) {
      fetchGet("/api/get-timezone", {
        "X-Country": choosedCountry,
      }).then((tmz) => {
        console.log(tmz.timezones.zones);
        setTimezones(tmz.timezones.zones);
      });
    }
  }, [choosedCountry]);

  const handleLocationChange = (location: string) => {
    toggleLocation(location);
  };

  const handleTimezoneChange = (timezone: string) => {
    toggleTimezone(timezone);
  }

  const handleAccept = async () => {
    await pageIsReady();
  };

  return (
    <div className="flex flex-col gap-4">
      <h1>Where are you from?</h1>
      <select
        defaultValue="Select location"
        className="select select-neutral"
        onChange={(e) => handleLocationChange(e.target.value)}
      >
        <option disabled={true}>Select location</option>
        {countries &&
          countries.map((country, i) => (
            <option key={i} value={country}>
              {country}
            </option>
          ))}
      </select>
      {choosedCountry && (
        <div className="flex flex-col gap-4">
          <h1>Select your timezone</h1>
          <select
            defaultValue="Select timezone"
            className="select select-neutral"
            onChange={(e) => handleTimezoneChange(e.target.value)}
          >
            <option disabled={true}>Select timezone</option>
            {timezones && timezones.map((timezone, i) => (
              <option key={i} value={timezone.gmtOffset}>{gmtOffsetToString(timezone.gmtOffset)}</option>
            ))}
          </select>
        </div>
      )}
      <AsyncButton
        func={handleAccept}
        isLoadingText="Loading data"
        isNormalText="Accept"
        className="btn btn-success"
      />
    </div>
  );
}

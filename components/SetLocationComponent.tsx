import { fetchGet } from "@/utils/utils";
import { useEffect, useState } from "react";
import AsyncButton from "./buttons/AsyncBtn";

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
    fetchGet("/api/get-countries")
    .then((data) => {
      setCountries(data);
    })
  }, []);

  useEffect(() => {
    if (choosedCountry) {
      fetchGet("/api/get-timezone", {
        "X-Country": choosedCountry,
      }).then((tmz) => {
        console.log("tmz: ", tmz);
        setTimezones(tmz);
      });
    }
  }, [choosedCountry]);

  return (
    <div className="bg-base-200 border border-base-300 rounded-2xl p-8 shadow-xl w-full max-w-sm animate-fade-in">
      <div className="space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">Where are you from?</h1>
          <p className="text-base-content/50 text-sm">Used to schedule lessons in your timezone</p>
        </div>

        <div className="space-y-3">
          <select
            defaultValue="Select location"
            className="select select-bordered w-full"
            onChange={(e) => toggleLocation(e.target.value)}
          >
            <option disabled>Select location</option>
            {countries?.map((country, i) => (
              <option key={i} value={country}>{country}</option>
            ))}
          </select>

          {choosedCountry && (
            <select
              defaultValue="Select timezone"
              className="select select-bordered w-full animate-fade-in"
              onChange={(e) => toggleTimezone(e.target.value)}
            >
              <option disabled>Select timezone</option>
              {timezones?.map((timezone, i) => (
                <option key={i} value={timezone}>
                  {timezone}
                </option>
              ))}
            </select>
          )}
        </div>

        <AsyncButton
          func={pageIsReady}
          isLoadingText="Saving..."
          isNormalText="Continue"
          className="btn btn-primary w-full rounded-xl hover:-translate-y-0.5 transition-transform duration-200"
        />
      </div>
    </div>
  );
}

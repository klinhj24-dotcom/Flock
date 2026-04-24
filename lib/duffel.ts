// Minimal Duffel REST client — just what we need for flight search in M1.
// Full SDK is at @duffel/api if we outgrow this.

const DUFFEL_API = "https://api.duffel.com";
const DUFFEL_VERSION = "v2";

export type DuffelOffer = {
  id: string;
  total_amount: string; // Duffel returns amounts as strings
  total_currency: string;
  owner: { name: string; iata_code: string };
  slices: Array<{
    origin: { iata_code: string; name: string };
    destination: { iata_code: string; name: string };
    duration: string; // ISO 8601
    segments: Array<{
      departing_at: string;
      arriving_at: string;
      origin: { iata_code: string };
      destination: { iata_code: string };
      operating_carrier: { name: string; iata_code: string };
      marketing_carrier: { name: string; iata_code: string };
    }>;
  }>;
};

export type FlightSearchInput = {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  cabinClass?: "economy" | "premium_economy" | "business" | "first";
};

export async function searchFlights(
  input: FlightSearchInput,
): Promise<DuffelOffer[]> {
  const apiKey = process.env.DUFFEL_API_KEY;
  if (!apiKey) throw new Error("DUFFEL_API_KEY not set");

  const slices: Array<{
    origin: string;
    destination: string;
    departure_date: string;
  }> = [
    {
      origin: input.origin,
      destination: input.destination,
      departure_date: input.departureDate,
    },
  ];
  if (input.returnDate) {
    slices.push({
      origin: input.destination,
      destination: input.origin,
      departure_date: input.returnDate,
    });
  }

  const body = {
    data: {
      passengers: Array.from({ length: input.adults }, () => ({
        type: "adult",
      })),
      slices,
      cabin_class: input.cabinClass ?? "economy",
    },
  };

  const res = await fetch(
    `${DUFFEL_API}/air/offer_requests?return_offers=true`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Duffel-Version": DUFFEL_VERSION,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Duffel API ${res.status}: ${text.slice(0, 400)}`);
  }

  const json = (await res.json()) as { data: { offers: DuffelOffer[] } };
  return json.data.offers ?? [];
}

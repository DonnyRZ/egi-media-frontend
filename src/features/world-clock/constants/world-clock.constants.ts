export interface WorldClockCity {
  label: string;
  timeZone: string;
}

export const WORLD_CLOCK_CITIES: WorldClockCity[] = [
  { label: "Jakarta", timeZone: "Asia/Jakarta" },
  { label: "New York", timeZone: "America/New_York" },
  { label: "London", timeZone: "Europe/London" },
  { label: "Dubai", timeZone: "Asia/Dubai" },
  { label: "Singapore", timeZone: "Asia/Singapore" },
  { label: "Tokyo", timeZone: "Asia/Tokyo" },
];

const shortMonths: Record<string, string[]> = {
  id: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  uz: ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avg", "sen", "okt", "noy", "dek"],
};
const fullMonths: Record<string, string[]> = {
  id: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  uz: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"],
};

/** Deterministic server/browser dates, including engines without Uzbek ICU data. */
export function editorialDate(date: Date, locale: string, { year = false, time = false, fullMonth = false } = {}): string {
  if (!Number.isFinite(date.getTime())) return "";
  const language = locale in shortMonths ? locale : "id";
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", day: "numeric", month: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  const month = (fullMonth ? fullMonths : shortMonths)[language][Number(value("month")) - 1];
  const label = language === "en" ? `${month} ${value("day")}` : `${value("day")} ${month}`;
  return `${label}${year ? `${language === "en" ? "," : ""} ${value("year")}` : ""}${time ? `, ${value("hour")}:${value("minute")}` : ""}`;
}

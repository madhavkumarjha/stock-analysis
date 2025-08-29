export async function fetchDailySeries(ticker, key) {
  const apikey = key || import.meta.env?.VITE_ALPHA_VANTAGE_KEY || "demo"; // demo works for IBM only
  const symbol = ticker.trim().toUpperCase();
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apikey}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Network error: ${res.status}`);
  const json = await res.json();
  if (json["Error Message"]) throw new Error("Invalid symbol or API error.");
  if (json["Note"])
    throw new Error("API limit reached. Try again later or use your own key.");

  const series = json["Time Series (Daily)"];
  if (!series) throw new Error("Unexpected response. Series missing.");

  // Convert to array sorted by date ascending
  const rows = Object.entries(series)
    .map(([date, row]) => ({
      date,
      open: Number(row["1. open"]),
      high: Number(row["2. high"]),
      low: Number(row["3. low"]),
      close: Number(row["4. close"]),
      volume: Number(row["5. volume"]),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return rows;
}

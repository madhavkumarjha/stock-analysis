import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Info,
  TrendingUp,
  SlidersHorizontal,
} from "lucide-react";

import { rollingSMA, rollingEMA, rollingRSI } from "./utils/indicators";
import { fetchDailySeries } from "./api/alphaVantage";
import Label from "./components/Label";
import Stat from "./components/Stat";
import Toggle from "./components/Toggle";
import { useDebounce } from "./utils/usedebounce";
import PriceChart from "./components/graphs/PriceChart";
import VolumeChart from "./components/graphs/VolumeChart";
import RSIChart from "./components/graphs/RSIChart";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  const [ticker, setTicker] = useState("AAPL");
  const [apiKey, setApiKey] = useState("");
  const [days, setDays] = useState(365);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // indicator toggles
  const [showSMA, setShowSMA] = useState(true);
  const [smaPeriod, setSmaPeriod] = useState(20);
  const [showEMA, setShowEMA] = useState(false);
  const [emaPeriod, setEmaPeriod] = useState(50);
  const [showRSI, setShowRSI] = useState(true);
  const [rsiPeriod, setRsiPeriod] = useState(14);

  const debouncedTicker = useDebounce(ticker, 400);

  useEffect(() => {
    handleFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleFetch(e) {
    if (e) e.preventDefault();
    if (!debouncedTicker) return;
    try {
      setLoading(true);
      setError("");
      const rows = await fetchDailySeries(debouncedTicker, apiKey);
      
      setData(rows);
    } catch (err) {
      setError(err.message || String(err));
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  // Slice window
  const windowed = useMemo(() => {
    if (!data?.length) return [];
    const start = Math.max(0, data.length - days);
    return data.slice(start);
  }, [data, days]);

  // Compute indicators
  const closeArr = useMemo(() => windowed.map((d) => d.close), [windowed]);
  const sma = useMemo(() => rollingSMA(closeArr, smaPeriod), [closeArr, smaPeriod]);
  const ema = useMemo(() => rollingEMA(closeArr, emaPeriod), [closeArr, emaPeriod]);
  const rsi = useMemo(() => rollingRSI(closeArr, rsiPeriod), [closeArr, rsiPeriod]);

  // Chart-ready data
  const chartData = useMemo(() => {
    return windowed.map((d, i) => ({
      date: d.date,
      close: d.close,
      volume: d.volume,
      sma: sma[i] ?? null,
      ema: ema[i] ?? null,
      rsi: rsi[i] ?? null,
    }));
  }, [windowed, sma, ema, rsi]);

  // Stats
  const latest = chartData.at(-1) || null;
  const first = chartData[0] || null;
  const pct =
    latest && first
      ? (((latest.close - first.close) / first.close) * 100).toFixed(2)
      : "—";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-neutral-950 dark:to-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* HEADER */}
     <Header/>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* SEARCH & CONTROLS */}
        <motion.form
          onSubmit={handleFetch}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 dark:bg-neutral-900/70 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-neutral-800"
        >
          <div className="grid md:grid-cols-3 gap-4">
            {/* Ticker */}
            <div className="flex flex-col">
              <Label htmlFor="ticker">Ticker</Label>
              <div className="relative mt-1">
                <input
                  id="ticker"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  placeholder="AAPL, MSFT, TSLA…"
                  className="w-full input border-gray-500 border px-2 py-1 text-sm rounded-xl pr-10"
                />
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* API Key */}
            <div className="flex flex-col">
              <Label htmlFor="apikey">Alpha Vantage API Key (optional)</Label>
              <input
                id="apikey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your key (or use demo)"
                className="w-full input border border-gray-500 px-3 py-1 text-sm rounded-xl mt-1"
              />
              <span className="text-xs  text-gray-500 mt-1">
                Without a key, only IBM will work due to demo limits.
              </span>
            </div>

            {/* Window */}
            <div className="flex flex-col">
              <Label htmlFor="window">Window</Label>
              <select
                id="window"
                className="select border border-gray-500 py-1 px-2 text-sm rounded-xl mt-1 text-gray-500"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
              >
                <option value={90}>Last 3 months</option>
                <option value={180}>Last 6 months</option>
                <option value={365}>Last 1 year</option>
                <option value={730}>Last 2 years</option>
                <option value={1825}>Last 5 years</option>
              </select>
            </div>
          </div>

          {/* Toggles & Buttons */}
          <div className="mt-4 grid md:grid-cols-3 gap-4 items-end">
            {/* Price overlays */}
            <div className="space-y-2 bg-gray-50 dark:bg-neutral-800 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                <Label>Price Overlays</Label>
              </div>
              <div className="flex flex-wrap gap-3">
                <Toggle label={`SMA (${smaPeriod})`} checked={showSMA} onChange={setShowSMA} />
                <input
                  type="number"
                  min={2}
                  max={400}
                  className="input input-xs border border-gray-500 text-gray-400 w-20 px-2 py-1 rounded-lg"
                  value={smaPeriod}
                  onChange={(e) => setSmaPeriod(Number(e.target.value))}
                />
                <Toggle label={`EMA (${emaPeriod})`} checked={showEMA} onChange={setShowEMA} />
                <input
                  type="number"
                  min={2}
                  max={400}
                  className="input input-xs border border-gray-500 text-gray-400  px-2 py-1 rounded-lg w-20"
                  value={emaPeriod}
                  onChange={(e) => setEmaPeriod(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Momentum */}
            <div className="space-y-2 bg-gray-50 dark:bg-neutral-800 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <Label>Momentum</Label>
              </div>
              <div className="flex items-center gap-3">
                <Toggle label={`RSI (${rsiPeriod})`} checked={showRSI} onChange={setShowRSI} />
                <input
                  type="number"
                  min={2}
                  max={100}
                  className="input input-xs border border-gray-500 px-2 py-1 rounded-lg w-20 text-gray-500"
                  value={rsiPeriod}
                  onChange={(e) => setRsiPeriod(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex md:justify-end gap-3">
              <button className="btn btn-primary rounded-xl" type="submit" disabled={loading}>
                {loading ? "Loading…" : "Fetch Data"}
              </button>
              <button
                className="btn btn-ghost rounded-xl"
                type="button"
                onClick={() => {
                  setTicker("IBM");
                  setApiKey("demo");
                }}
              >
                Use Demo (IBM)
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-warning mt-4 rounded-xl flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </motion.form>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Symbol" value={debouncedTicker.toUpperCase()} />
          <Stat label="Latest Close" value={latest ? latest.close.toFixed(2) : "—"} />
          <Stat label="Period Change" value={pct !== "—" ? `${pct}%` : "—"} />
          <Stat label="Last Point" value={latest ? latest.date : "—"} hint="Most recent trading day" />
        </div>

        {/* PRICE CHART */}
        <section className="bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-neutral-800">
          <h2 className="text-base font-semibold mb-2">Price (Adjusted Close)</h2>
          <PriceChart chartData={chartData} showSMA={showSMA} smaPeriod={smaPeriod} showEMA={showEMA} emaPeriod={emaPeriod} />
        </section>

        {/* VOLUME */}
        <section className="bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-neutral-800">
          <h2 className="text-base font-semibold mb-2">Volume</h2>
         <VolumeChart chartData={chartData} />
        </section>

        {/* RSI */}
        {showRSI && (
          <section className="bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-neutral-800">
            <h2 className="text-base font-semibold mb-2">RSI ({rsiPeriod})</h2>
           <RSIChart  chartData={chartData} />
          </section>
        )}

      <Footer/>
      </main>
    </div>
  );
}

function toNumber(n) {
  if (n === null || n === undefined) return NaN;
  const x = Number(n);
  return Number.isFinite(x) ? x : NaN;
}

function rollingSMA(values, period) {
  const out = new Array(values.length).fill(null);
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    const v = toNumber(values[i]);
    sum += v;
    if (i >= period) sum -= toNumber(values[i - period]);
    if (i >= period - 1) out[i] = sum / period;
  }
  return out;
}

function rollingEMA(values, period) {
  const out = new Array(values.length).fill(null);
  const k = 2 / (period + 1);
  let emaPrev = null;
  for (let i = 0; i < values.length; i++) {
    const price = toNumber(values[i]);
    if (i === 0) {
      emaPrev = price; // seed
      out[i] = emaPrev;
    } else {
      const ema = price * k + emaPrev * (1 - k);
      out[i] = ema;
      emaPrev = ema;
    }
  }
  return out;
}

function rollingRSI(values, period = 14) {
  const out = new Array(values.length).fill(null);
  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const change = toNumber(values[i]) - toNumber(values[i - 1]);
    if (change >= 0) gains += change; else losses -= change;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  out[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  for (let i = period + 1; i < values.length; i++) {
    const change = toNumber(values[i]) - toNumber(values[i - 1]);
    const gain = Math.max(change, 0);
    const loss = Math.max(-change, 0);
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  }
  return out;
}

export { rollingSMA, rollingEMA, rollingRSI };
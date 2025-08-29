import {
  Brush,
  CartesianGrid,
  Legend,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
    Line,
} from "recharts";

function PriceChart({ chartData, showSMA, smaPeriod, showEMA, emaPeriod }) {
    console.log("Rendering PriceChart with data:", chartData);
    
  return (
    <div className="w-full h-[360px]">
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{ left: 8, right: 12, top: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="date" minTickGap={32} />
          <YAxis domain={["auto", "auto"]} allowDataOverflow />
          <Tooltip
            formatter={(value, name) => [
              Number(value)?.toFixed(2),
              name.toUpperCase(),
            ]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="close"
            dot={false}
            strokeWidth={2}
            name="Close"
          />
          {showSMA && (
            <Line
              type="monotone"
              dataKey="sma"
              dot={false}
              strokeDasharray="4 2"
              name={`SMA ${smaPeriod}`}
            />
          )}
          {showEMA && (
            <Line
              type="monotone"
              dataKey="ema"
              dot={false}
              strokeDasharray="2 2"
              name={`EMA ${emaPeriod}`}
            />
          )}
          <Brush dataKey="date" height={20} travellerWidth={10} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PriceChart;

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

function RSIChart({ chartData }) {
  return (
    <div className="w-full h-[240px]">
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{ left: 8, right: 12, top: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="date" minTickGap={32} />
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(v) => Number(v)?.toFixed(2)} />
          <Line type="monotone" dataKey="rsi" dot={false} name="RSI" />
          <ReferenceLine y={30} strokeDasharray="3 3" />
          <ReferenceLine y={70} strokeDasharray="3 3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RSIChart;

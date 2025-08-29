import {
  BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

function VolumeChart({chartData}) {
  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{ left: 8, right: 12, top: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="date" minTickGap={32} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="volume" name="Volume" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default VolumeChart;

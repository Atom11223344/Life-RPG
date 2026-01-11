"use client"

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';

export function StatsRadar({ str, int, vit }: { str: number, int: number, vit: number }) {
  
  // จัดเตรียมข้อมูลสำหรับกราฟ
  const data = [
    { subject: 'STR (Body)', A: str, fullMark: 100 },
    { subject: 'INT (Brain)', A: int, fullMark: 100 },
    { subject: 'VIT (Health)', A: vit, fullMark: 100 },
  ];

  return (
    <div className="w-full h-[300px] bg-card/50 rounded-xl border border-border p-2">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#4b5563" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 'bold' }} />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
          <Radar
            name="Stats"
            dataKey="A"
            stroke="#eab308"
            strokeWidth={3}
            fill="#eab308"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
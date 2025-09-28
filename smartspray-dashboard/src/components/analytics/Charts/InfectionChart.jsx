import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const InfectionChart = ({ data }) => {
  const chartData = data.map(item => ({
    date: new Date(item._id).toLocaleDateString(),
    infectionRate: item.infectionRate || 0,
    detectionAccuracy: item.detectionAccuracy || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="infectionRate" stroke="#ff7300" fill="#ff7300" fillOpacity={0.3} name="Infection Rate (%)" />
        <Area type="monotone" dataKey="detectionAccuracy" stroke="#387908" fill="#387908" fillOpacity={0.3} name="Detection Accuracy (%)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default InfectionChart;
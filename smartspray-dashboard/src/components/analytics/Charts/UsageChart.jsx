import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UsageChart = ({ data }) => {
  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    pesticide: item.metrics?.pesticideUsed || 0,
    area: item.metrics?.areaSprayed || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="pesticide" stroke="#8884d8" name="Pesticide (L)" />
        <Line type="monotone" dataKey="area" stroke="#82ca9d" name="Area (ha)" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default UsageChart;
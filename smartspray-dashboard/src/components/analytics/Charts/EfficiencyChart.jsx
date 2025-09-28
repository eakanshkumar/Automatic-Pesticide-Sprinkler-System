import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EfficiencyChart = ({ data }) => {
  const chartData = [
    {
      name: 'Traditional',
      pesticide: data.traditionalPesticide || 0,
      cost: data.traditionalCost || 0,
    },
    {
      name: 'Precision',
      pesticide: data.precisionPesticide || 0,
      cost: data.precisionCost || 0,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="pesticide" fill="#8884d8" name="Pesticide (L)" />
        <Bar dataKey="cost" fill="#82ca9d" name="Cost (₹)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EfficiencyChart;
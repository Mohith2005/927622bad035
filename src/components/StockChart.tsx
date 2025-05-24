import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, TextField, MenuItem } from '@mui/material';
import { Stock, stockService } from '../services/stockService';

interface StockChartProps {
  ticker: string;
}

export const StockChart = ({ ticker }: StockChartProps) => {
  const [stockData, setStockData] = useState<Stock[]>([]);
  const [timeInterval, setTimeInterval] = useState<number>(30);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await stockService.getStockPrice(ticker, timeInterval);
        setStockData(data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(intervalId);
  }, [ticker, timeInterval]);

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <TextField
        select
        label="Time Interval (minutes)"
        value={timeInterval}
        onChange={(e) => setTimeInterval(Number(e.target.value))}
        sx={{ mb: 2 }}
      >
        {[5, 15, 30, 60].map((interval) => (
          <MenuItem key={interval} value={interval}>
            {interval} minutes
          </MenuItem>
        ))}
      </TextField>
      <ResponsiveContainer>
        <LineChart data={stockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

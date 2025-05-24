import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Stock, stockService } from '../services/stockService';

// Helper function to calculate Pearson correlation coefficient
const calculateCorrelation = (x: number[], y: number[]): number => {
  const n = x.length;
  const sum1 = x.reduce((a, b) => a + b);
  const sum2 = y.reduce((a, b) => a + b);
  const sum1Sq = x.reduce((a, b) => a + b * b);
  const sum2Sq = y.reduce((a, b) => a + b * b);
  const pSum = x.map((x, i) => x * y[i]).reduce((a, b) => a + b);
  const num = pSum - (sum1 * sum2 / n);
  const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
  return den === 0 ? 0 : num / den;
};

export const CorrelationHeatmap = () => {
  const [stocks, setStocks] = useState<Stock[][]>([]);
  const [tickers, setTickers] = useState<string[]>([]);
  const [correlationMatrix, setCorrelationMatrix] = useState<number[][]>([]);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const allStocks = await stockService.getAllStocks();
        const uniqueTickers = Array.from(new Set(allStocks.map(stock => stock.ticker)));
        setTickers(uniqueTickers);

        // Fetch historical data for each stock
        const stocksData = await Promise.all(
          uniqueTickers.map(ticker => stockService.getStockPrice(ticker, 60))
        );
        setStocks(stocksData);

        // Calculate correlation matrix
        const matrix = stocksData.map((stock1, i) => 
          stocksData.map((stock2, j) => {
            const prices1 = stock1.map(s => s.price);
            const prices2 = stock2.map(s => s.price);
            return calculateCorrelation(prices1, prices2);
          })
        );
        setCorrelationMatrix(matrix);
      } catch (error) {
        console.error('Error fetching correlation data:', error);
      }
    };

    fetchStockData();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Stock Price Correlation Heatmap</Typography>
      <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: `repeat(${tickers.length + 1}, 1fr)` }}>
        <Box /> {/* Empty corner cell */}
        {tickers.map(ticker => (
          <Typography key={ticker} sx={{ fontWeight: 'bold' }}>{ticker}</Typography>
        ))}
        {tickers.map((ticker, i) => (
          <>
            <Typography sx={{ fontWeight: 'bold' }}>{ticker}</Typography>
            {correlationMatrix[i]?.map((correlation, j) => (
              <Box
                key={`${i}-${j}`}
                sx={{
                  backgroundColor: `hsl(${((correlation + 1) / 2) * 120}, 70%, 50%)`,
                  p: 1,
                  textAlign: 'center',
                  color: 'white'
                }}
              >
                {correlation.toFixed(2)}
              </Box>
            ))}
          </>
        ))}
      </Box>
    </Box>
  );
};

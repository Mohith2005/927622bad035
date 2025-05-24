import axios from 'axios';

const BASE_URL = 'http://20.244.56.144/evaluation-service';

export interface Stock {
    ticker: string;
    price: number;
    timestamp: string;
}

export const stockService = {
    async getAllStocks(): Promise<Stock[]> {
        const response = await axios.get(`${BASE_URL}/stocks`);
        return response.data;
    },

    async getStockPrice(ticker: string, minutes: number): Promise<Stock[]> {
        const response = await axios.get(`${BASE_URL}/stocks/${ticker}?minutes=${minutes}`);
        return response.data;
    }
};

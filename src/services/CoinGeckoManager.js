// src/services/CoinGeckoManager.js
import axios from 'axios';
import { config } from 'dotenv';

config();

class CoinGeckoManager {
    constructor() {
        this.apiKey = process.env.COIN_GECKO_API_KEY;
        this.baseUrl = 'https://api.coingecko.com/api/v3';
    }

    async getTop100Coins() {
        try {
            const response = await axios.get(`${this.baseUrl}/coins/markets`, {
                params: {
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: 100,
                    page: 1
                },
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching data from CoinGecko:', error);
            throw error;
        }
    }
}

export default new CoinGeckoManager();

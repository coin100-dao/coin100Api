// src/services/CoinGeckoManager.js
const axios = require('axios');
const { config } = require('dotenv');

config();

class CoinGeckoManager {
    constructor() {
        this.apiKey = process.env.COIN_GECKO_API_KEY;
        this.baseUrl = 'https://api.coingecko.com/api/v3';
    }

    async getTop100Coins() {
        try {
            console.log('Fetching top 100 coins from CoinGecko...');
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
            // console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching data from CoinGecko:', error);
            throw error;
        }
    }
}

module.exports = new CoinGeckoManager();

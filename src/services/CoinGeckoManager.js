// src/services/CoinGeckoManager.js
import axios from 'axios';
import { config } from 'dotenv';
import logger from '../utils/logger.js';

config();

class CoinGeckoManager {
    constructor() {
        this.apiKey = process.env.COIN_GECKO_API_KEY;
        this.baseUrl = 'https://api.coingecko.com/api/v3';
        this.retryDelay = 1000; // 1 second delay between retries
        this.maxRetries = 3;
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getTop100Coins() {
        let retries = 0;
        while (retries < this.maxRetries) {
            try {
                logger.info('Attempting to fetch data from CoinGecko...');
                const response = await axios.get(`${this.baseUrl}/coins/markets`, {
                    params: {
                        vs_currency: 'usd',
                        order: 'market_cap_desc',
                        per_page: 100,
                        page: 1,
                        sparkline: false
                    },
                    headers: this.apiKey ? {
                        'x-cg-pro-api-key': this.apiKey
                    } : {}
                });

                if (!response.data || !Array.isArray(response.data)) {
                    throw new Error('Invalid response format from CoinGecko');
                }

                logger.info(`Successfully fetched ${response.data.length} coins from CoinGecko`);
                return response.data;
            } catch (error) {
                retries++;
                const status = error.response?.status;
                const message = error.response?.data?.error || error.message;

                logger.error('Error fetching data from CoinGecko:', {
                    status,
                    message,
                    attempt: retries,
                    maxRetries: this.maxRetries
                });

                if (status === 429 || status === 503) {
                    logger.info(`Rate limited. Waiting ${this.retryDelay}ms before retry...`);
                    await this.sleep(this.retryDelay);
                    this.retryDelay *= 2; // Exponential backoff
                    continue;
                }

                if (retries === this.maxRetries) {
                    throw new Error(`Failed to fetch data after ${this.maxRetries} attempts: ${message}`);
                }

                await this.sleep(this.retryDelay);
            }
        }
    }
}

export default new CoinGeckoManager();

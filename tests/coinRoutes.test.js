import request from 'supertest';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { app, startServer } from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let server;

beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.PORT = '5556';
    server = await startServer();
}, 10000);

afterAll(async () => {
    if (server) {
        await new Promise((resolve) => {
            server.close(resolve);
        });
    }
});

describe('Coin API Routes', () => {
    describe('GET /api/coins', () => {
        it('should return coin data for a recent time period', async () => {
            const endDate = new Date();
            const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

            const response = await request(app)
                .get('/api/coins')
                .query({
                    start: startDate.toISOString(),
                    end: endDate.toISOString()
                })
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('dateRange');
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);

            // Verify data structure
            const firstEntry = response.body.data[0];
            expect(firstEntry).toHaveProperty('symbol');
            expect(firstEntry).toHaveProperty('current_price');
            expect(firstEntry).toHaveProperty('market_cap');
            expect(firstEntry).toHaveProperty('last_updated');
        });

        it('should return coin data for a custom date range', async () => {
            const endDate = new Date();
            const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

            const response = await request(app)
                .get('/api/coins')
                .query({
                    start: startDate.toISOString(),
                    end: endDate.toISOString()
                })
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('dateRange');
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        it('should handle invalid date formats gracefully', async () => {
            const response = await request(app)
                .get('/api/coins')
                .query({
                    start: 'invalid-date',
                    end: 'invalid-date'
                })
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('success', false);
            expect(response.body.error).toContain('Invalid date format');
        });

        it('should return 401 without API key', async () => {
            const response = await request(app)
                .get('/api/coins');

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'API key is required');
        });
    });

    describe('GET /api/coins/symbol/:symbol', () => {
        it('should return data for a specific coin', async () => {
            const symbol = 'btc';
            const endDate = new Date();
            const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

            const response = await request(app)
                .get(`/api/coins/symbol/${symbol}`)
                .query({
                    start: startDate.toISOString(),
                    end: endDate.toISOString()
                })
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('dateRange');
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
            response.body.data.forEach(item => {
                expect(item.symbol.toLowerCase()).toBe(symbol);
                expect(item).toHaveProperty('current_price');
                expect(item).toHaveProperty('market_cap');
                expect(item).toHaveProperty('last_updated');
            });
        });

        it('should return 404 when no data in date range', async () => {
            const symbol = 'btc';
            const futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 1);

            const response = await request(app)
                .get(`/api/coins/symbol/${symbol}`)
                .query({
                    start: futureDate.toISOString(),
                    end: new Date(futureDate.getTime() + 24 * 60 * 60 * 1000).toISOString()
                })
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('success', false);
            expect(response.body.error).toBe('No data found for the specified coin in the given date range');
        });

        it('should return a week of price data with multiple data points', async () => {
            const symbol = 'btc';
            const endDate = new Date();
            const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

            const response = await request(app)
                .get(`/api/coins/symbol/${symbol}`)
                .query({
                    start: startDate.toISOString(),
                    end: endDate.toISOString()
                })
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('dateRange');
            expect(response.body).toHaveProperty('data');
            expect(response.body).toHaveProperty('count');
            expect(Array.isArray(response.body.data)).toBe(true);
            
            // Explicit verification of multiple data points
            expect(response.body.count).toBeGreaterThan(1);
            expect(response.body.data.length).toBe(response.body.count);
            expect(response.body.data.length).toBeGreaterThan(1);
            
            // Verify data structure and ordering
            const data = response.body.data;
            expect(data[0]).toHaveProperty('current_price');
            expect(data[0]).toHaveProperty('last_updated');
            
            // Verify chronological ordering
            for (let i = 1; i < data.length; i++) {
                const prevTime = new Date(data[i-1].last_updated).getTime();
                const currTime = new Date(data[i].last_updated).getTime();
                expect(prevTime).toBeLessThanOrEqual(currTime);
            }

            // Verify all entries are within date range
            const startTime = startDate.getTime();
            const endTime = endDate.getTime();
            data.forEach(item => {
                const itemTime = new Date(item.last_updated).getTime();
                expect(itemTime).toBeGreaterThanOrEqual(startTime);
                expect(itemTime).toBeLessThanOrEqual(endTime);
                expect(item.symbol.toLowerCase()).toBe(symbol);
            });
        });

        it('should return 404 for non-existent coin symbol', async () => {
            const response = await request(app)
                .get('/api/coins/symbol/nonexistentcoin')
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('success', false);
            expect(response.body.error).toBe('No data found for the specified coin in the given date range');
        });
    });

    describe('GET /api/coins/market/total', () => {
        it('should return total market cap data for the last 5 minutes by default', async () => {
            const response = await request(app)
                .get('/api/coins/market/total')
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('dateRange');
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
            response.body.data.forEach(item => {
                expect(item).toHaveProperty('total_market_cap');
            });
        });
    });
});

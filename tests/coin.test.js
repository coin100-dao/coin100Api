import { expect } from 'chai';
import request from 'supertest';
import { app, server, startServer } from '../index.js';

describe('Coin API Tests', () => {
    let testServer;

    before(async function() {
        this.timeout(10000); // Increase timeout to 10 seconds
        process.env.NODE_ENV = 'test';
        process.env.PORT = 5556; // Use a different port for this test suite
        testServer = await startServer();
    });

    after(async function() {
        this.timeout(5000); // Increase timeout for cleanup
        if (testServer) {
            await new Promise((resolve) => testServer.close(resolve));
        }
    });

    describe('GET /api/coins', () => {
        it('should return coin data for the last 5 minutes by default', async function() {
            this.timeout(5000);
            const response = await request(app)
                .get('/api/coins')
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('dateRange').that.is.an('object');
            expect(response.body.dateRange).to.have.property('start');
            expect(response.body.dateRange).to.have.property('end');
            expect(response.body).to.have.property('data').that.is.an('array');
            
            // Verify data structure if data exists
            if (response.body.data.length > 0) {
                const firstCoin = response.body.data[0];
                expect(firstCoin).to.have.property('id');
                expect(firstCoin).to.have.property('symbol');
                expect(firstCoin).to.have.property('name');
                expect(firstCoin).to.have.property('market_cap_rank');
                expect(firstCoin).to.have.property('current_price');
                expect(firstCoin).to.have.property('market_cap');
                expect(firstCoin).to.have.property('last_updated');
            }
        });

        it('should return coin data for a custom date range (last week)', async function() {
            this.timeout(5000);
            const endDate = new Date();
            const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

            const response = await request(app)
                .get(`/api/coins?start=${startDate.toISOString()}&end=${endDate.toISOString()}`)
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('dateRange').that.is.an('object');
            expect(new Date(response.body.dateRange.start)).to.be.at.most(startDate);
            expect(new Date(response.body.dateRange.end)).to.be.at.least(startDate);
        });

        it('should handle invalid date formats gracefully', async function() {
            this.timeout(5000);
            const response = await request(app)
                .get('/api/coins?start=invalid-date&end=also-invalid')
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('success', false);
            expect(response.body).to.have.property('error').that.includes('Invalid date format');
        });
    });

    describe('GET /api/coins/coin', () => {
        it('should return data for a specific coin within the last week', async function() {
            this.timeout(5000);
            const endDate = new Date();
            const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

            const response = await request(app)
                .get(`/api/coins/coin?symbol=BTC&start=${startDate.toISOString()}&end=${endDate.toISOString()}`)
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('dateRange').that.is.an('object');
            expect(response.body).to.have.property('data').that.is.an('array');
            
            if (response.body.data.length > 0) {
                const coin = response.body.data[0];
                expect(coin).to.have.property('symbol', 'btc');
                expect(new Date(coin.last_updated)).to.be.at.least(startDate);
                expect(new Date(coin.last_updated)).to.be.at.most(endDate);
            }
        });

        it('should return 400 for missing symbol', async function() {
            this.timeout(5000);
            const response = await request(app)
                .get('/api/coins/coin')
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('success', false);
            expect(response.body).to.have.property('error').that.includes('Symbol is required');
        });

        it('should return 404 for non-existent symbol', async function() {
            this.timeout(5000);
            const endDate = new Date();
            const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

            const response = await request(app)
                .get(`/api/coins/coin?symbol=NONEXISTENT&start=${startDate.toISOString()}&end=${endDate.toISOString()}`)
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('success', false);
            expect(response.body).to.have.property('error').that.includes('No data found for symbol');
        });
    });
});

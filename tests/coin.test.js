import { expect } from 'chai';
import request from 'supertest';
import { app, server, startServer } from '../index.js';

describe('Coin API Tests', () => {
    let testServer;

    before(async () => {
        process.env.NODE_ENV = 'test';
        testServer = await startServer();
    });

    after((done) => {
        if (testServer) {
            testServer.close(done);
        } else {
            done();
        }
    });

    describe('GET /api/coins', () => {
        it('should return coin data within the last 5 minutes by default', async () => {
            const response = await request(app)
                .get('/api/coins')
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('period', '5m');
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

        it('should return coin data for a custom time period', async () => {
            const response = await request(app)
                .get('/api/coins?period=1h')
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('period', '1h');
            expect(response.body).to.have.property('data').that.is.an('array');
        });

        it('should reject invalid period format', async () => {
            const response = await request(app)
                .get('/api/coins?period=invalid')
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('success', false);
            expect(response.body).to.have.property('error').that.includes('Invalid period format');
        });

        it('should require API key', async () => {
            const response = await request(app)
                .get('/api/coins');

            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('message', 'API key is required');
        });
    });
});

import { expect } from 'chai';
import request from 'supertest';
import { app, server, startServer } from '../index.js';
import db from '../src/models/index.js';

describe('Total Market Cap API Tests', () => {
    let testServer;
    let testData;

    before(async function() {
        this.timeout(10000); // Increase timeout to 10 seconds
        process.env.NODE_ENV = 'test';
        process.env.PORT = 5557; // Use a different port for this test suite
        
        // Start server
        testServer = await startServer();
        
        // Wait for database connection
        await db.sequelize.authenticate();
        
        // Clean existing data
        await db.TotalTop100Cap.destroy({
            where: {},
            truncate: true,
            cascade: true
        });

        // Create test data spanning a week
        const now = new Date();
        testData = [];
        
        // Create data points for the last week (one per hour)
        for(let i = 0; i < 168; i++) { // 24 * 7 = 168 hours in a week
            testData.push({
                timestamp: new Date(now.getTime() - (i * 60 * 60 * 1000)), // i hours ago
                total_market_cap: (2000000000000 + i * 1000000).toString() // Slightly different values
            });
        }

        // Insert test data
        await db.TotalTop100Cap.bulkCreate(testData);
    });

    after(async function() {
        this.timeout(5000); // Increase timeout for cleanup
        
        // Clean up test data
        await db.TotalTop100Cap.destroy({
            where: {},
            truncate: true,
            cascade: true
        });

        if (testServer) {
            await new Promise((resolve) => testServer.close(resolve));
        }
    });

    describe('GET /api/coins/market/total', () => {
        it('should return total market cap data for the last 5 minutes by default', async function() {
            this.timeout(5000);
            const response = await request(app)
                .get('/api/coins/market/total')
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('dateRange').that.is.an('object');
            expect(response.body.dateRange).to.have.property('start');
            expect(response.body.dateRange).to.have.property('end');
            expect(response.body).to.have.property('data').that.is.an('array');
        });

        it('should return data for a specific date range (last week)', async function() {
            this.timeout(5000);
            const endDate = new Date();
            const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

            const response = await request(app)
                .get(`/api/coins/market/total?start=${startDate.toISOString()}&end=${endDate.toISOString()}`)
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('dateRange').that.is.an('object');
            expect(new Date(response.body.dateRange.start)).to.be.at.most(startDate);
            expect(new Date(response.body.dateRange.end)).to.be.at.least(startDate);
            
            // Should have approximately 168 data points (one per hour for a week)
            expect(response.body.data.length).to.be.within(150, 168);
            
            // Verify data structure
            const firstDataPoint = response.body.data[0];
            expect(firstDataPoint).to.have.property('timestamp');
            expect(firstDataPoint).to.have.property('total_market_cap');
            expect(new Date(firstDataPoint.timestamp)).to.be.within(startDate, endDate);
        });

        it('should handle invalid date formats gracefully', async function() {
            this.timeout(5000);
            const response = await request(app)
                .get('/api/coins/market/total?start=invalid-date&end=also-invalid')
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('success', false);
            expect(response.body).to.have.property('error').that.includes('Invalid date format');
        });

        it('should return empty data array for future date range', async function() {
            this.timeout(5000);
            const startDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Tomorrow
            const endDate = new Date(Date.now() + 48 * 60 * 60 * 1000); // Day after tomorrow

            const response = await request(app)
                .get(`/api/coins/market/total?start=${startDate.toISOString()}&end=${endDate.toISOString()}`)
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body.data).to.be.an('array').that.is.empty;
        });
    });
});

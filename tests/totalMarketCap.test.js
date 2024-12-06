import { expect } from 'chai';
import request from 'supertest';
import { app, server, startServer } from '../index.js';
import db from '../src/models/index.js';

describe('Total Market Cap API Tests', () => {
    let testServer;

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

        // Insert test data
        await db.TotalTop100Cap.bulkCreate([
            {
                timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
                total_market_cap: '2000000000000'
            },
            {
                timestamp: new Date(Date.now() - 1000 * 60 * 4), // 4 minutes ago
                total_market_cap: '1950000000000'
            },
            {
                timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
                total_market_cap: '1900000000000'
            }
        ]);
    });

    after(async function() {
        this.timeout(5000); // Increase timeout for cleanup
        
        // Clean up test data
        await db.TotalTop100Cap.destroy({
            where: {},
            truncate: true,
            cascade: true
        });

        // Close database connection
        await db.sequelize.close();

        // Close server
        if (testServer) {
            await new Promise((resolve) => testServer.close(resolve));
        }
    });

    describe('GET /api/coins/market/total', () => {
        it('should return total market cap data within the last 5 minutes by default', async function() {
            this.timeout(5000);
            const response = await request(app)
                .get('/api/coins/market/total')
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('period', '5m');
            expect(response.body).to.have.property('data').that.is.an('array');
            
            // Should return 2 records (within last 5 minutes)
            expect(response.body.data).to.have.lengthOf(2);
            
            // Verify data structure
            const firstRecord = response.body.data[0];
            expect(firstRecord).to.have.property('timestamp');
            expect(firstRecord).to.have.property('total_market_cap');
            expect(firstRecord.total_market_cap).to.be.a('string'); // DECIMAL is returned as string
        });

        it('should return total market cap data for a custom time period', async function() {
            this.timeout(5000);
            const response = await request(app)
                .get('/api/coins/market/total?period=1h')
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('period', '1h');
            expect(response.body).to.have.property('data').that.is.an('array');
            
            // Should return all 3 records (within last hour)
            expect(response.body.data).to.have.lengthOf(3);
        });

        it('should reject invalid period format', async function() {
            const response = await request(app)
                .get('/api/coins/market/total?period=invalid')
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('success', false);
            expect(response.body).to.have.property('error').that.includes('Invalid period format');
        });

        it('should require API key', async function() {
            const response = await request(app)
                .get('/api/coins/market/total');

            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('message', 'API key is required');
        });

        it('should handle empty data periods gracefully', async function() {
            this.timeout(5000);
            
            // Clear the test data
            await db.TotalTop100Cap.destroy({
                where: {},
                truncate: true,
                cascade: true
            });

            const response = await request(app)
                .get('/api/coins/market/total')
                .set('x-api-key', process.env.COIN100_API_KEY);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('period', '5m');
            expect(response.body).to.have.property('data').that.is.an('array');
            expect(response.body.data).to.have.lengthOf(0);
        });
    });
});

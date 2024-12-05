// src/services/CloudflareDNSManager.js
import axios from 'axios';
import { config } from 'dotenv';

config();

export class CloudflareDNSManager {
    constructor(domain) {
        this.apiKey = process.env.CLOUDFLARE_API_KEY;
        this.token = process.env.CLOUDFLARE_API_TOKEN;
        this.apiEmail = process.env.CLOUDFLARE_EMAIL;
        this.AccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        this.zoneId = process.env.CLOUDFLARE_ZONE_ID;
        this.domain = domain;

        // Create axios instance with base URL and auth headers
        this.client = axios.create({
            baseURL: 'https://api.cloudflare.com/client/v4',
            headers: {
                'X-Auth-Key': this.apiKey,
                'X-Auth-Email': this.apiEmail,
                'Content-Type': 'application/json'
            }
        });
    }

    async updateDNSRecord() {
        try {
            const publicIp = await this.getPublicIp();
            const dnsRecord = await this.getDNSRecord();
            
            if (!dnsRecord) {
                throw new Error('No matching DNS record found.');
            }

            await this.updateRecord(dnsRecord.id, publicIp);
            console.log(`Successfully updated DNS record for ${this.domain} to ${publicIp}`);
        } catch (error) {
            throw new Error(`Failed to update DNS record: ${error.message}`);
        }
    }

    async getPublicIp() {
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
            return response.data.ip;
        } catch (error) {
            throw new Error(`Failed to get public IP: ${error.message}`);
        }
    }

    async getDNSRecord() {
        try {
            console.log('Fetching DNS records for zone:', this.zoneId);
            const response = await this.client.get(`/zones/${this.zoneId}/dns_records`);
            
            if (response.data.result) {
                return response.data.result.find(record => record.name === this.domain && record.type === 'A');
            }
            return null;
        } catch (error) {
            console.error('Cloudflare API Error:', error.response?.data || error.message);
            throw new Error(`Failed to fetch DNS record: ${error.message}`);
        }
    }

    async updateRecord(recordId, newIp) {
        try {
            await this.client.put(`/zones/${this.zoneId}/dns_records/${recordId}`, {
                type: 'A',
                name: this.domain,
                content: newIp,
                ttl: 1 // Auto TTL
            });
        } catch (error) {
            console.error('Update Error:', error.response?.data || error.message);
            throw new Error(`Failed to update DNS record: ${error.message}`);
        }
    }

    async createRecord(ip) {
        try {
            await this.client.post(`/zones/${this.zoneId}/dns_records`, {
                type: 'A',
                name: this.domain,
                content: ip,
                proxied: true,
                ttl: 1 // Auto TTL
            });
        } catch (error) {
            console.error('Create Error:', error.response?.data || error.message);
            throw new Error(`Failed to create DNS record: ${error.message}`);
        }
    }

    async deleteRecord(recordId) {
        try {
            await this.client.delete(`/zones/${this.zoneId}/dns_records/${recordId}`);
        } catch (error) {
            console.error('Delete Error:', error.response?.data || error.message);
            throw new Error(`Failed to delete DNS record: ${error.message}`);
        }
    }
}

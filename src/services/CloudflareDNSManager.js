// src/services/CloudflareDNSManager.js
import Cloudflare from 'cloudflare';
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

        this.cloudflare = new Cloudflare({
            token: this.token,
            // If using API Key authentication instead of token:
            // apiKey: process.env.CLOUDFLARE_API_KEY,
            // apiEmail: process.env.CLOUDFLARE_EMAIL,
        });
        this.zoneId = this.zoneId;
    }

    async updateDNSRecord() {
        try {
            const publicIp = await this.getPublicIp();
            const dnsRecord = await this.getDNSRecord();
            
            if (!dnsRecord) {
                throw new Error('No matching DNS record found.');
            }

            // await this.updateRecord(dnsRecord.id, publicIp);
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
            const response = await this.cloudflare.dnsRecords.browse(this.zoneId, {
                type: 'A',
                name: this.domain
            });
            console.log(response);
            return response.result[0]; // Get the first matching record
        } catch (error) {
            throw new Error(`Failed to fetch DNS record: ${error.message}`);
        }
    }

    async updateRecord(recordId, newIp) {
        try {
            await this.cloudflare.dnsRecords.edit(this.zoneId, recordId, {
                type: 'A',
                name: this.domain,
                content: newIp,
                proxied: true,
                ttl: 1 // Auto TTL
            });
        } catch (error) {
            throw new Error(`Failed to update DNS record: ${error.message}`);
        }
    }

    // Additional helper methods if needed
    async createRecord(ip) {
        try {
            await this.cloudflare.dnsRecords.create(this.zoneId, {
                type: 'A',
                name: this.domain,
                content: ip,
                proxied: true,
                ttl: 1 // Auto TTL
            });
        } catch (error) {
            throw new Error(`Failed to create DNS record: ${error.message}`);
        }
    }

    async deleteRecord(recordId) {
        try {
            await this.cloudflare.dnsRecords.del(this.zoneId, recordId);
        } catch (error) {
            throw new Error(`Failed to delete DNS record: ${error.message}`);
        }
    }
}

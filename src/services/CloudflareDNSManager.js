// src/services/CloudflareDNSManager.js
import axios from 'axios';
import { config } from 'dotenv';
import { Cloudflare } from 'cloudflare';

config();

export class CloudflareDNSManager {
    constructor(domain) {
        this.apiKey = process.env.CLOUDFLARE_API_KEY;
        this.token = process.env.CLOUDFLARE_API_TOKEN;
        this.apiEmail = process.env.CLOUDFLARE_EMAIL;
        this.zoneId = process.env.CLOUDFLARE_ZONE_ID;
        this.AccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        this.domain = domain;
        this.cf = new Cloudflare({
            token: this.token
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
            const response = await this.cf.dnsRecords.browse(this.zoneId);
            const records = response.result;
            return records.find(record => record.name === this.domain);
        } catch (error) {
            throw new Error(`Failed to fetch DNS record: ${error.message}`);
        }
    }

    async updateRecord(recordId, newIp) {
        try {
            await this.cf.dnsRecords.edit(this.zoneId, recordId, {
                type: 'A',
                name: this.domain,
                content: newIp,
                proxied: true
            });
        } catch (error) {
            throw new Error(`Failed to update DNS record: ${error.message}`);
        }
    }
}

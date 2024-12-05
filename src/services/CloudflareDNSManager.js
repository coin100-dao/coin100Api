// src/services/CloudflareDNSManager.js
import axios from 'axios';
import { config } from 'dotenv';

config();

export class CloudflareDNSManager {
    constructor(domain) {
        this.apiKey = process.env.CLOUDFLARE_API_KEY;
        this.apiEmail = process.env.CLOUDFLARE_EMAIL;
        this.zoneId = process.env.CLOUDFLARE_ZONE_ID;
        this.domain = domain;
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
            const response = await axios.get(
                `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/dns_records`,
                {
                    headers: {
                        'X-Auth-Email': this.apiEmail,
                        'X-Auth-Key': this.apiKey,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log(response);
            const records = response.data.result;
            return records.find(record => record.name === this.domain);
        } catch (error) {
            throw new Error(`Failed to fetch DNS record: ${error.message}`);
        }
    }

    async updateRecord(recordId, newIp) {
        try {
            await axios.put(
                `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/dns_records/${recordId}`,
                {
                    type: 'A',
                    name: this.domain,
                    content: newIp,
                    proxied: true,
                },
                {
                    headers: {
                        'X-Auth-Email': this.apiEmail,
                        'X-Auth-Key': this.apiKey,
                        'Content-Type': 'application/json',
                    },
                }
            );
        } catch (error) {
            throw new Error(`Failed to update DNS record: ${error.message}`);
        }
    }
}

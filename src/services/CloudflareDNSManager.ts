import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export class CloudflareDNSManager {
    private readonly apiKey: string;
    private readonly apiEmail: string;
    private readonly zoneId: string;
    private readonly domain: string;

    constructor(domain: string) {
        this.apiKey = process.env.CLOUDFLARE_API_KEY || '';
        this.apiEmail = process.env.CLOUDFLARE_USER_EMAIL || '';
        this.zoneId = process.env.CLOUDFLARE_ZONE_ID || '';
        this.domain = domain;

        if (!this.apiKey || !this.apiEmail || !this.zoneId) {
            throw new Error('CLOUDFLARE_API_KEY, CLOUDFLARE_USER_EMAIL, and CLOUDFLARE_ZONE_ID are required');
        }
    }

    async getCurrentInstanceIP(): Promise<string> {
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
            return response.data.ip;
        } catch (error) {
            throw new Error(`Failed to fetch current instance IP: ${error}`);
        }
    }

    async getDNSRecord(): Promise<any> {
        try {
            const url = `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/dns_records?type=A&name=${this.domain}`;
            const response = await axios.get(url, {
                headers: {
                    'X-Auth-Email': this.apiEmail,
                    'X-Auth-Key': this.apiKey,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.data.success) {
                throw new Error(`Failed to fetch DNS records: ${JSON.stringify(response.data.errors)}`);
            }

            const records = response.data.result;
            if (records.length === 0) {
                throw new Error('No matching DNS record found.');
            }

            return records[0]; // Assuming only one A record for the domain
        } catch (error) {
            throw new Error(`Failed to fetch DNS record: ${error}`);
        }
    }

    async updateDNSRecord(): Promise<void> {
        try {
            const currentIP = await this.getCurrentInstanceIP();
            const record = await this.getDNSRecord();

            if (record.content === currentIP) {
                console.log('DNS record is already up to date.');
                return;
            }
            console.log('Updating DNS record...', record);

            const url = `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/dns_records/${record.id}`;
            const response = await axios.put(
                url,
                {
                    type: 'A',
                    name: this.domain,
                    content: currentIP,
                    ttl: 1, // Auto TTL
                    proxied: record.proxied,
                },
                {
                    headers: {
                        'X-Auth-Email': this.apiEmail,
                        'X-Auth-Key': this.apiKey,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.data.success) {
                throw new Error(`Failed to update DNS record: ${JSON.stringify(response.data.errors)}`);
            }

            console.log('DNS record updated successfully.');
        } catch (error) {
            throw new Error(`Failed to update DNS record: ${error}`);
        }
    }
}


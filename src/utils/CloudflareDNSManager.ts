import { Cloudflare } from 'cloudflare';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export class CloudflareDNSManager {
    private client: Cloudflare;
    private readonly zoneId: string;
    private readonly domain: string;

    constructor() {
        if (!process.env.CLOUDFLARE_API_TOKEN) {
            throw new Error('CLOUDFLARE_API_TOKEN is required');
        }

        this.client = new Cloudflare({
            token: process.env.CLOUDFLARE_API_TOKEN
        });
        
        this.domain = 'coin100.link';
        this.zoneId = process.env.CLOUDFLARE_ZONE_ID || '';
    }

    async getCurrentInstanceIP(): Promise<string> {
        try {
            const response = await axios.get('http://169.254.169.254/latest/meta-data/public-ipv4');
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch EC2 instance IP');
        }
    }

    async updateDNSRecord(): Promise<void> {
        try {
            const currentIP = await this.getCurrentInstanceIP();
            
            // Get existing DNS records
            const dnsRecords = await this.client.dnsRecords.browse(this.zoneId);
            const existingRecord = dnsRecords.result.find(
                record => record.type === 'A' && record.name === this.domain
            );

            if (existingRecord) {
                // Update existing record
                await this.client.dnsRecords.edit(this.zoneId, existingRecord.id, {
                    type: 'A',
                    name: this.domain,
                    content: currentIP,
                    ttl: 1, // Auto TTL
                    proxied: true
                });
                console.log(`Successfully updated A record for ${this.domain} to ${currentIP}`);
            } else {
                throw new Error(`No existing A record found for ${this.domain}`);
            }
        } catch (error) {
            console.error('Failed to update DNS record:', error);
            throw error;
        }
    }
}

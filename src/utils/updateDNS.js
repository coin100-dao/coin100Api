// src/utils/updateDNS.js
import { CloudflareDNSManager } from '../services/CloudflareDNSManager.js';
import { config } from 'dotenv';

// Load environment variables
config();

// Debug logging
console.log('Environment variables loaded:');
console.log('CLOUDFLARE_API_TOKEN:', process.env.CLOUDFLARE_API_TOKEN ? 'Set' : 'Not set');
console.log('CLOUDFLARE_API_KEY:', process.env.CLOUDFLARE_API_KEY ? 'Set' : 'Not set');
console.log('CLOUDFLARE_EMAIL:', process.env.CLOUDFLARE_EMAIL ? 'Set' : 'Not set');
console.log('CLOUDFLARE_ZONE_ID:', process.env.CLOUDFLARE_ZONE_ID ? 'Set' : 'Not set');

if (!process.env.CLOUDFLARE_EMAIL) {
    console.error('Error: CLOUDFLARE_EMAIL environment variable is required');
    process.exit(1);
}

// Usage example:
const domain = 'coin100.link'; // Update with your domain
const dnsManager = new CloudflareDNSManager(domain);

dnsManager
    .updateDNSRecord()
    .then(() => console.log('DNS update process completed.'))
    .catch((error) => {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    });

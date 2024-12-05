// src/utils/updateDNS.js
import { CloudflareDNSManager } from '../services/CloudflareDNSManager.js';
import { config } from 'dotenv';

// Load environment variables
config();

// Usage example:
const domain = 'api.coin100.link'; // Update with your domain
const dnsManager = new CloudflareDNSManager(domain);

dnsManager
    .updateDNSRecord()
    .then(() => console.log('DNS update process completed.'))
    .catch((error) => {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    });

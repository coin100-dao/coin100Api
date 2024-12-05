// src/utils/updateDNS.js
import { CloudflareDNSManager } from '../services/CloudflareDNSManager.js';

// Usage example:
const domain = 'coin100.link'; // Update with your domain
const dnsManager = new CloudflareDNSManager(domain);

dnsManager
    .updateDNSRecord()
    .then(() => console.log('DNS update process completed.'))
    .catch((error) => console.error(`Error: ${error.message}`));
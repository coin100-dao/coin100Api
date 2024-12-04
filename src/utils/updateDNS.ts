import { CloudflareDNSManager } from './CloudflareDNSManager';

async function updateDNSRecord() {
    try {
        const dnsManager = new CloudflareDNSManager();
        await dnsManager.updateDNSRecord();
        console.log('DNS record updated successfully');
    } catch (error) {
        console.error('Failed to update DNS record:', error);
        process.exit(1);
    }
}

// Run the update
updateDNSRecord();

const dns = require('dns');

const srvHostname = '_mongodb._tcp.cluster0.eh6szmx.mongodb.net';

console.log(`Resolving SRV for ${srvHostname}...`);

dns.resolveSrv(srvHostname, (err, addresses) => {
    if (err) {
        console.error('Failed to resolve SRV:', err);
        return;
    }

    console.log('SRV Records found:');
    const hosts = addresses.map(a => a.name + ':' + a.port);
    console.log(hosts.join(','));

    console.log('\n--- Suggested Standard Connection String ---');
    console.log('Replace <password> and <username> with your actual credentials:');
    
    // Assuming the user has the username/db locally or can edit it. 
    // I won't print the secret parts, just the host part.
    const hostString = hosts.join(',');
    console.log(`mongodb://${hostString}/newonePhoto?ssl=true&replicaSet=atlas-eh6szmx-shard-0&authSource=admin&retryWrites=true&w=majority`);
});

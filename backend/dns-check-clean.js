const dns = require('dns');
const fs = require('fs');

const domain = 'cluster0.eh6szmx.mongodb.net';
const shard0 = 'cluster0-shard-00-00.eh6szmx.mongodb.net';

let output = '';

dns.lookup(domain, (err, address) => {
    output += `Main Domain: ${err ? 'Error: ' + err.code : address}\n`;
    
    dns.lookup(shard0, (err2, address2) => {
        output += `Shard 0: ${err2 ? 'Error: ' + err2.code : address2}\n`;
        fs.writeFileSync('backend/dns-result.txt', output);
        console.log('Done.');
    });
});

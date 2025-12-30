const dns = require('dns');

const shards = [
    'cluster0-shard-00-00.eh6szmx.mongodb.net',
    'cluster0-shard-00-01.eh6szmx.mongodb.net',
    'cluster0-shard-00-02.eh6szmx.mongodb.net'
];

console.log('Checking shard accessibility...');

shards.forEach(shard => {
    dns.lookup(shard, (err, address, family) => {
        if (err) {
            console.log(`❌ ${shard} - Failed: ${err.code}`);
        } else {
            console.log(`✅ ${shard} - Resolved to ${address}`);
        }
    });
});

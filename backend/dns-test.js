const dns = require('dns');
console.log('Resolving _mongodb._tcp.cluster0.eh6szmx.mongodb.net...');
dns.resolveSrv('_mongodb._tcp.cluster0.eh6szmx.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('SRV Resolve Error:', err);
    
    console.log('Trying A record for cluster0.eh6szmx.mongodb.net...');
    dns.resolve4('cluster0.eh6szmx.mongodb.net', (err2, a) => {
        if (err2) console.error('A Resolve Error:', err2);
        else console.log('A Records:', a);
    });

  } else {
    console.log('SRV Records:', addresses);
  }
});

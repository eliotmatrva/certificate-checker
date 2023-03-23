const https = require('https');
const domainList = require('./domains.json')


function httpsHead(url, params = {
    method: 'HEAD',
  }) {
    return new Promise(function(resolve, reject) {
        var req = https.request(url, params, function(res) {
          resolve(res.socket.getPeerCertificate());
        });
        req.on('error', function(err) {
          reject(err);
        });
        req.end();
    });
  }
  
//   let domainList = [
//     'https://www.duckduckgo.com/',
//     'https://www.twitter.com/',
//     'https://www.google.com/',
//     'https://www.brave.com/',
//   ]
  
  async function allTheCerts (domains) {
    let certificatePromises = []
  
    domains.forEach(domain => {
      certificatePromises.push(httpsHead(domain.domain))
    })
  
    return await Promise.allSettled(certificatePromises)
  }
(async ()=>{
    let certs = await allTheCerts(domainList);
    console.log(certs);
})();


const https = require('https');
const fs = require('fs');
//const fetch = require("isomorphic-fetch");
// const sslCertificate = require('get-ssl-certificate');
const express = require('express');
const app = express();
const domainList = require('./domains2.json');

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('public'));
const PORT = 3000;

function writeCertsFile(content) {
    console.log('trying to writeFile');
    fs.writeFileSync('./certs.json', JSON.stringify(content));
}


function isEmpty(object) {
    for (var prop in object) {
      if (object.hasOwnProperty(prop)) return false;
    }
  
    return true;
  }
  
  function pemEncode(str, n) {
    var ret = [];
  
    for (var i = 1; i <= str.length; i++) {
      ret.push(str[i - 1]);
      var mod = i % n;
  
      if (mod === 0) {
        ret.push('\n');
      }
    }
  
    var returnString = `-----BEGIN CERTIFICATE-----\n${ret.join('')}\n-----END CERTIFICATE-----`;
  
    return returnString;
  }
  
  function getOptions(url, port, protocol) {
    return {
      hostname: url,
      agent: false,
      rejectUnauthorized: false,
      ciphers: 'ALL',
      port,
      protocol
    };
  }
  
  function validateUrl(url) {
    if (url.length <= 0 || typeof url !== 'string') {
      throw Error('A valid URL is required');
    }
  }
  
  function handleRequest(options, detailed = false, resolve, reject) {
    return https.get(options, function(res) {
      var certificate = res.socket.getPeerCertificate(detailed);
  
      if (isEmpty(certificate) || certificate === null) {
        reject({ message: 'The website did not provide a certificate' });
      } else {
        if (certificate.raw) {
          certificate.pemEncoded = pemEncode(certificate.raw.toString('base64'), 64);
        }
        resolve(certificate);
      }
    });
  }
  
  function get(url, timeout, port, protocol, detailed) {
    validateUrl(url);
  
    port = port || 443;
    protocol = protocol || 'https:';
  
    var options = getOptions(url, port, protocol);
  
    return new Promise(function(resolve, reject) {
      var req = handleRequest(options, detailed, resolve, reject);
  
      if (timeout) {
        req.setTimeout(timeout, function() {
          reject({ message: 'Request timed out.' });
          req.destroy();
        });
      }
  
      req.on('error', function(e) {
        reject(e);
      });
  
      req.end();
    });
  }

  async function getCert(domain){
    return await get(domain);
    // console.log(cert);
  }

let domains = [
    'google.com',
    'yahoo.com',
    'bing.com'
]

async function getAllCerts(){
    let certList = [];
    for await (const domain of domains){
        certList.push(await getCert(domain));
}
    writeCertsFile(certList);
    console.log(certList);
    return certList;
}

getAllCerts();
// getCert('bing.com');


app.listen(PORT, ()=>{
    console.log(`app running on port ${PORT}`);
})
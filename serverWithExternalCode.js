const https = require("https");
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
/*
function getAllCertDetails(){
    for (let i = 0; i < domainList.length; i++){
        retrieveCertDetails(domainList[i]);        
    }
}

// console.log(JSON.stringify(domainList));

async function retrieveCertDetails(site){
    let cert;
    sslCertificate.get(site.domain).then(function (certificate) {
        let name = site.name;
        console.log(`----- Cert Details for ${name} -----`);
        console.log(certificate.subject);
        console.log(certificate.issuer);
        console.log(certificate.valid_from);
        console.log(`valid to ${certificate.valid_to}`);
        console.log(`----------------------END-------------------------`);
        console.log(`                                                  `);
        cert = certificate;
      });
    console.log(`i did it ${cert}`);
    return cert;
}

getAllCertDetails();
*/

async function getPeerCert(resSocket) {
    let cert = await resSocket.getPeerCertificate();
    console.log(cert);
    return cert;
}
/* WORKING getCert function
async function getCert(domain) {
    return new Promise((resolve) => {
        let data ='';

        https.get(domain, res => {
            res.on('data', chunk => { data += chunk});
            res.on('end', () => {
                resolve(res.socket.getPeerCertificate());
            })
        })
    })
}
*/

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

// async function extractCertDetails(domain){
//     return await getCert(domain);
    //console.log(JSON.stringify(cert.valid_to));
    //return cert;
//}
    // let theResSocket = (async () => {
    //     https.get(domain, async (res) => {
    //         let resSocket = await getPeerCert(res.socket);
    //         console.log(resSocket);
    //         // return resSocket
    //     });
    // })();
    // return theResSocket;

async function getAllCerts(){
    let allCerts = [];
    for await (const domain of domainList) {
        let thisCert = await get(domain.domain, 1000, 433, 'https:');
        allCerts.push(thisCert);
    }
    //console.log(allCerts);
    return allCerts;
}
    
getAllCerts();

app.get('/api/helloWorld', (req, res) => {
    res.send(`<div> Welcome to your barebones Node App</div>`);
})

app.get('/api/allCerts', async (req, res) => {
    let payload = await getAllCerts();
    console.log(payload);
    res.send(JSON.stringify(payload));
})

app.get('/api/getCerts', async (req, res) => {
    let cert = await getCert('https://www.google.com')
    let certName = await cert.subject.CN;
    let validFrom = await cert.valid_from;
    let validTo = await cert.valid_to;
    let certDetails = {
        certName, validFrom, validTo
    }
    res.send(`hello this is my cert ${JSON.stringify(certDetails)}`);
})

app.listen(PORT, ()=>{
    console.log(`app running on port ${PORT}`);
})
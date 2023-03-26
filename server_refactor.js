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
  
function handleRequest(options, detailed = false, resolve, reject) {
  return https.get(options, function(res) {
    var certificate = res.socket.getPeerCertificate(detailed);
      resolve(certificate);
  });
}
  
function get(url, timeout, detailed) {

  let options = {
    hostname: url,
    agent: false,
    rejectUnauthorized: false,
    ciphers: 'ALL',
    port: 443,
    protocol: 'https:'
  }
  
async function getSomething(){
  return await https.get('https://google.com');
}

async function fetchSomething(){
  return await fetch('https://google.com');
}

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
  return await get(domain, 10000, false);
  // console.log(cert);
}

let domains = [
    'google.com',
    'yahoo.com',
    'bing.com'
]

async function getAllCerts(){
    let certList = [];
    for await (const domain of domainList){
        certList.push(await getCert(domain.domain));
}
    
    console.log(certList);
    let refinedCertList = [];
    certList.map(cert => {
        refinedCertList.push({ 'site' : cert.subject.CN, 'valid from' :cert.valid_from, 'valid to' : cert.valid_to });
    });
    writeCertsFile(refinedCertList);
    console.log(`These are the basic cert details:
        ${JSON.stringify(refinedCertList)}`)
    return refinedCertList;
    
}

// getAllCerts();
// getCert('bing.com');

app.get('/api/allCerts', (req, res) => {
    let cachedCertData = fs.readFileSync('./certs.json');
    console.log(`Received Get Request from
        ${req.headers}`);
    console.log('sending cached cert data');
    res.send(cachedCertData);
});

app.get('/api/helloWorld', (req, res) => {
    let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
    console.log(`Received Get Request from
        ${ip}`);
    res.send('hello world');
});

let certRefresh = setInterval(async () => {
    let certUpdate = await getAllCerts();
    fs.appendFileSync('./app.log', ` ${new Date} : hopefully the cert update occurred.
    Here's what we got!
    ${JSON.stringify(certUpdate)}`);
}, 30000);

app.listen(PORT, ()=>{
    console.log(`app running on port ${PORT}`);
});
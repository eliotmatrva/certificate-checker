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

https.get('https://google.com', (res) => {
    console.log(`-------------------------------- https.get response ----------------------------------------`)
    console.log(res.socket);
})

// fetch('https://google.com')
//     .then(res => {
//         console.log(`-------------------------------- fetch response ----------------------------------------`)
//         console.log(res);
//     })

async function getPeerCert(resSocket) {
    let cert = await resSocket.getPeerCertificate();
    console.log
    return cert;
}

async function getSocket(domain) {
    https.get(domain, async (res) => {
        resSocket = await getPeerCert(res.socket);
        console.log(resSocket);
        return resSocket
        });
}

async function allTheCerts(domainList) {
    let fetchingPromises = []
  
    domainList.forEach((site) => {
      fetchingPromises.push(
        fetch(site.domain)
            .then(async res => await JSON.stringify(res.text()))
      )
    })
  
    return await Promise.allSettled(fetchingPromises)
}

// async function allTheCerts(domainList) {
//     let fetchingPromises = []
  
//     domainList.forEach((site) => {
//       fetchingPromises.push(
//         https.get(site.domain, async res => {
//             await Promise.resolve(res.socket.getPeerCertificate())
//         })
//       )
//     })
  
//     return await Promise.allSettled(fetchingPromises)
// }
  
// get all the certs
(async () => {
    let certLog = await allTheCerts(domainList)
    console.log('should have all the certs', certLog)
})()


app.get('/api/getCerts', (req, res) => {
    res.send()
})

app.listen(PORT, ()=>{
    console.log(`app running on port ${PORT}`);
})
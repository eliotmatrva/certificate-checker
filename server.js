const https = require("https");
const fetch = require("isomorphic-fetch");
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

async function getSocket(domain) {
    https.get(domain, async (res) => {
        resSocket = await getPeerCert(res.socket);
        console.log(resSocket);
        return resSocket
        });
}


async function getAllCerts(){
    let certArray = ['THIS IS CERTARRAYYYYYYYYYYY!'];
    let i = domainList.length - 1;
    console.log(`--------START! i = ${i} -----------`);
    while (i > -1) {
        console.log(`first domain is ${domainList[i].name} | ${domainList[i].domain}`)
        let cert = await getSocket(domainList[i].domain);
        //certArray.push(cert);
        console.log(cert);
        i--;
    } 
    console.log(`--------END! i = ${i} -----------`)
    //console.log(certArray);
    //return certArray;        
}


getAllCerts();

app.get('/api/helloWorld', (req, res) => {
    res.send(`<div> Welcome to your barebones Node App</div>`);
})

app.get('/api/getCerts', (req, res) => {
    res.send()
})

app.listen(PORT, ()=>{
    console.log(`app running on port ${PORT}`);
})
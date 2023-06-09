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

async function getPeerCert(resSocket) {
    let cert = await resSocket.getPeerCertificate();
    console.log(cert);
    return cert;
}

async function getCert(domain) {
    return new Promise((resolve) => {
        let data ='';

        https.get(domain)
            .on('data', chunk => { data += chunk})
            .on('end', (goodies) => {
                goodies.socket.getPeerCertificate();
            })
            
        })
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
        let thisCert = await getCert(domain.domain);
        console.log(thisCert);
        allCerts.push(thisCert);
    }
    console.log(allCerts);
    
    return allCerts;
}
    
// getAllCerts();

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

let server = app.listen(PORT, ()=>{
    console.log(`app running on port ${PORT}`);
})
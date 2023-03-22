const https = require("https");
// const sslCertificate = require('get-ssl-certificate');
const express = require('express');
const app = express();
const domainList = require('./domains.json');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('public'));
const PORT = 3000;


async function fetchSSL(url) {
    let cert;
    https.get(url, (res) => {
        cert = res.socket.getPeerCertificate();
        console.log(cert);
        return cert;
    });
}


// async function buildCertList() {
//     certList = [];
//     console.log(domainList);
//     for (let i=0; i < domainList.length; i++){async ()=>{

    
//         await fetchSSL(domainList[i].domain);
//         console.log(`loop iteration 1 data:  ${certList}`);
//     }    
//     }
//     console.log(`for loop finished result:  ${certList}`);
// }

function writeTestSslJson(certList){
    fs.writeFileSync('./testSSL.json', JSON.stringify(certList));
}

async function retrieveSSL(url) {
    let certList = [];
    const forLoop = async () => {
        console.log('Loop Start');
        for (let i = 0; i < domainList.length; i++) {
            https.get(domainList[i].domain, async (res) => {
                let cert = await res.socket.getPeerCertificate().valid_to;
                certList.push([domainList[i].name, cert]);
                console.log(`Loop Iteration ${i}:  ${certList}`)
            });
        }
    }
    await forLoop();
    
    console.log('Loop End');
    console.log(certList);
    writeTestSslJson(certList);
    
        //fs.writeFileSync('./testSSL.json', JSON.stringify(cert));
    
}

async function getPeerCert(resSocket){
    const cert = await resSocket.getPeerCertificate();
    //console.log (`getPeerCert Result: Valid to ${JSON.stringify(cert)}`);
    return cert;
}
async function retriveCertHttps(site){
    //Why can't I do let myCert = await https.get()...?????
    let myCert =
    https.get(site.domain, async (res) => {
        let cert = await getPeerCert(res.socket);
        //console.log(` `);
        //console.log(`!!!!!!!retrieveCertHttps Result:!!!!!!!!`);
        //console.log(`${site.name}`);
        //console.log(`${JSON.stringify(cert)}`)   
        return cert;
    });
    return myCert;
}

// async function forLoop() {
//     let certList = [];
//     for (let i = 0; i < domainList.length; i++) {
//         let cert = await retriveCertHttps(domainList[i]);
//         certList.push([domainList[i].name, cert]);
//         console.log(`!!!!!!!!!!LOOP 1!!!!!!!!!!!! ${'\n', certList.valid_to}`)
//     }
// }

async function httpGet(site){
    return new Promise((resolve, reject) => {
        https.get(site.domain, (res) => {
            let cert = getPeerCert(res.socket);
            resolve(cert);
            console.log(cert);
        })
    })
}

async function forLoop() {
    let certList = [];
    for (let i = 0; i < domainList.length; i++) {
        let cert = await httpGet(domainList[i]);
        certList.push([domainList[i].name, cert]);
        console.log(`!!!!!!!!!!LOOP 1!!!!!!!!!!!! ${'\n', certList.valid_to}`)
    }
    return certList;
}



/************* FUNCTIONAL 
let sslCertList = [];
async function updateAllCerts(){
    sslCertList = [];
    for (let i = 0; i < domainList.length; i++){
        await new Promise(async next=> {
            let cert = await retriveCertHttps(domainList[i]);
            sslCertList.push({
                "name": domainList[i].name,
                "cert": cert
            })
            console.log(`Loop ${i}`)
            console.log(sslCertList);
            next()
        })
    }
    console.log(`After Loop!!!!!`)
    console.log(sslCertList);
}
 ****************************** */


// async function updateAllCerts(){
//     certList = [];
//     await forLoop();
//     console.log(certList);
//     return certList;
// }

// ;(async () => {
//     const certList = await updateAllCerts()
//     console.log(certList);
//   })()

// updateAllCerts()
//     .then(console.log(sslCertList));
// retriveCertHttps('https://google.com');





app.get('/api/helloWorld', (req, res) => {
    res.send(`<div> Welcome to your barebones Node App</div>`);
})

app.get('/api/getCerts', (req, res) => {
    res.send()
})

app.listen(PORT, ()=>{
    console.log(`app running on port ${PORT}`);
})
const https = require("https");
const express = require('express');
const app = express();
const domainList = require('./domains2.json');

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('public'));
const PORT = 3000;

function getCert(url) {
    let options = {
        hostname: url,
        agent: false,
        rejectUnauthorized: false,
        ciphers: 'ALL',
        port: 443,
        protocol: 'https:'
      }

    // return new Promise((resolve, reject) => {
    //     let req = https.request(options);
    //     return req.on('response', (res) => {
    //         resolve(req.getPeerCertificate());
    //     });
    // });
    return new Promise((resolve, reject) => {
        https.get(options, res => {
            resolve(res.socket.getPeerCertificate());
        })        
    })  
}

async function getCerts(){
    console.log(`START`);
    await domainList.forEach(async domain => {
        let cert = await getCert(domain.domain);
        console.log(cert);
    })
    console.log(`END`);       
        // return cert;
}

let certRefresh = setInterval(() => {
    getCerts();
}, 10000);

// let scheduler = setInterval(() => {
//     promisedCert()
//         .then(res => {
//             console.log(res);
//         })
// }, 5000);


// need to add return cert to getCerts for app.get('/api/getCerts... to work
app.get('/api/getCerts', async (req, res) => {
    let certs = await getCerts();
    res.send(certs);
})

app.listen(PORT, ()=>{
    console.log(`app running on port ${PORT}`);
})
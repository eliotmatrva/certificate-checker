const https = require("https");
const domainList = [
        {
            name: 'bing',
            domain: 'bing.com'
        },
        {
            name: 'google',
            domain: 'poodiddlestankpee.com'
        }
    ]

function getCert(url) {
    let options = {
        hostname: url,
        agent: false,
        rejectUnauthorized: false,
        ciphers: 'ALL',
        port: 443,
        protocol: 'https:'
      }

    return new Promise((resolve, reject) => {
        https.get(options, res => {
            let status = res.status;
            let statusCode = res.statusCode;
            console.log(`!!--------  Starting ${options.hostname}  -------!!`);
            console.log(`statusCode is ${statusCode}`);
            if (statusCode === 200 || statusCode === 301) {
                resolve(res.socket.getPeerCertificate());
            } else {
                reject(() => {
                    console.log(statusCode);
                    return statusCode;
                })
            }            
        })
        .on('error', (e) => {
            console.log(e.code);
        })        
    })  
}

async function getCerts(){
    for (const domain of domainList){
        let cert = await getCert(domain.domain);
        console.log(cert);
    }
}

let certRefresh = setInterval(() => {
    getCerts();
}, 10000);

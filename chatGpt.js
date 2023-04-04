const https = require("https");
const domainList = [
        {
            name: 'bing',
            domain: 'bing.com'
        },
        {
            name: 'google',
            domain: 'google.com'
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
        try {
            https.get(options, res => {
                let statusCode = res.statusCode;
                console.log(statusCode);
                if (statusCode === 200) {
                    resolve(res.socket.getPeerCertificate());
                } else {
                    reject(statusCode);
                }
            });
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    }).catch(err => {
        console.log(err);
    });  
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

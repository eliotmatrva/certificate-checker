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

// Maintain a hash of all connected sockets
var sockets = {}, nextSocketId = 0;
server.on('connection', function (socket) {
  // Add a newly connected socket
  var socketId = nextSocketId++;
  sockets[socketId] = socket;
  console.log('socket', socketId, 'opened');

  // Remove the socket when it closes
  socket.on('close', function () {
    console.log('socket', socketId, 'closed');
    delete sockets[socketId];
  });

  // Extend socket lifetime for demo purposes
  socket.setTimeout(4000);
});

// Count down from 10 seconds
(function countDown (counter) {
  console.log(counter);
  if (counter > 0)
    return setTimeout(countDown, 1000, counter - 1);

  // Close the server
  server.close(function () { console.log('Server closed!'); });
  // Destroy all open sockets
  for (var socketId in sockets) {
    console.log('socket', socketId, 'destroyed');
    sockets[socketId].destroy();
  }
})(10);

async function getPeerCert(resSocket) {
    let cert = await resSocket.getPeerCertificate();
    console.log(cert);
    return cert;
}

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
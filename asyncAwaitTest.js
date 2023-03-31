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


// async function getACert(){
//   let thaSite = await fetch('https://google.com');
//   // let thaCert = thaSite.socket.getPeerCertificate();
//   console.log(thaSite);
// }

// function getACert(){
//   let thaSite = await fetch('https://google.com');
//   // let thaCert = thaSite.socket.getPeerCertificate();
//   console.log(thaSite);
// }


getACert();

// let certRefresh = setInterval(async () => {
//     let certUpdate = await getAllCerts();
//     let logEntry = logPrep(certUpdate);
//     fs.appendFileSync('./appLog.json', JSON.stringify(logEntry));
// }, 30000);

app.listen(PORT, ()=>{
    console.log(`app running on port ${PORT}`);
});

const socket = new WebSocket("https://google.com");

// Connection opened
socket.addEventListener("open", (event) => {
  socket.send("Hello Server!");
});

// Listen for messages
socket.addEventListener("message", (event) => {
  console.log("Message from server ", event.data);
});
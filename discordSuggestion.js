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


// https.get('https://google.com', (res) => {
//     console.log(`-------------------------------- https.get response ----------------------------------------`)
//     console.log(res.socket);
// })

 fetch('https://google.com')
    .then(res => {
        console.log(`-------------------------------- fetch response ----------------------------------------`)
        console.log(res.socket)
    })
    .catch(err => {
        console.log(err)
    })



app.get('/api/getCerts', (req, res) => {
    res.send()
})

app.listen(PORT, ()=>{
    console.log(`app running on port ${PORT}`);
})
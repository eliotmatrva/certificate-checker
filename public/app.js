

async function fetchCerts(){
    return await fetch('http://localhost:3000/api/allCerts')

    // let certs = JSON.stringify(fetched);
}

async function filterCertData(certs){
    let filtered = []
    certs.map(cert => {
        filtered.push(
            {
                "site" : cert.subject.cn,
                "issued" : cert.valid_from,
                "expires" : cert.valid_to 
            }
        )
    })
    return filtered;
}

async function populateTable(){
    fetchCerts.then(res => {
        // CODE HERE
    })
}

function resetTable(){
 let tableBody = document.getElementById('')
}

function createTableRow(){

}


async function displayCerts(){
    let certs = await fetchCerts();
    //let filteredCerts = await filterCertData(certs);
    return certs;
}

displayCerts()
    .then((res) => {
        console.log(res);
        let root = document.getElementById('root');
        root.textContent = res;
    //root.innerHTML = res;
});

// async function fetchCertDetails(){
//     let certs = await fetch('http://localhost:3000/api/getCerts');
//     return await certs.text();
// }

// fetchCertDetails().then((res) => {
//     console.log(res);
// })
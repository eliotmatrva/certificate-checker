

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

function createTableRow(cert) {
    var table = document.getElementById('certTable');
    var tableBody = document.getElementById("tableBody");
    var row = tableBody.insertRow(0);
    row.id = `site_${cert.site}`
    row.classList.add("certRow");
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = cert.site;
    cell2.innerHTML = cert.validFrom;
    cell3.innerHTML = cert.validTo;
}

async function populateTable(){
    let response = await fetchCerts();
    let data = await response.json();

    for (let i = 0; i < data.length; i++){
    createTableRow(data[i]);
    }
    console.log(data);
}

populateTable();
  
  //Removes all children of the table body
//   function resetTable(){
//     let table = document.getElementById(tableId);
//     let tableBody = table.querySelector("tbody");
//     let rowCount = table.querySelectorAll(".channelRow");
//     while (tableBody.lastChild) {
//       tableBody.removeChild(tableBody.lastChild);
//     }
//   }
  

// async function displayCerts(){
//     let certs = await fetchCerts();
//     //let filteredCerts = await filterCertData(certs);
//     return certs;
// }

// displayCerts()
//     .then((res) => {
//         console.log(res);
//         let root = document.getElementById('root');
//         root.textContent = res;
//     //root.innerHTML = res;
// });



// fetchCertDetails().then((res) => {
//     console.log(res);
// })

function writeExportButton() {

    let table = document.getElementById("statTable");
    let title = table.firstElementChild

    let exportButton = document.createElement("button"); 

    let lineBreak = document.createElement("br"); 

    exportButton.setAttribute("id","exportButton");
    exportButton.setAttribute("class","btn");
    exportButton.setAttribute("onclick","exportToCSV()");

    exportButton.innerText = "Export To CSV";

    title.appendChild(lineBreak);
    title.appendChild(exportButton);

}

function exportToCSV() {


    let gameTableDiv = document.getElementById('gameTable');

    let gameTable = gameTableDiv.querySelector("table")

    var csv_data = [];
 
    // TODO: find a way to cache the data in browser so we don't have to parse out the table like this
    // Get each row data
    var rows = gameTable.getElementsByTagName('tr');

    for (var i = 0; i < rows.length; i++) {
 
        // Get each column data
        var cols = rows[i].querySelectorAll('td,th');
 
        // Stores each csv row data
        var csvrow = [];
        for (var j = 0; j < cols.length; j++) {
 
            cell = cols[j].innerHTML;
            // Get the text data of each cell of
            if (cols[j].firstElementChild != null){
                console.log("here");
                csvrow.push(cols[j].firstElementChild.getAttribute("href"));
            }
            else {
                // a row and push it to csvrow
                csvrow.push(cell);
            }

        }
 
        // Combine each column value with comma
        csv_data.push(csvrow.join(","));
    }
    // combine each row data with new line character
    csv_data = csv_data.join('\n');

    csvFile = new Blob([csv_data], {type: 'text/csv'})

    var a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(csvFile);

    // a.href = window.URL.createObjectURL( csv, {type: 'text/csv'});

    // let today = new Date().format('Y-m-d');   //  07-06-2016 06:38:34
    let today = new Date().toISOString().slice(0, 10)
    let uname = document.getElementById("title").textContent;
    let fname = `chess_com_${uname}_${today.replace("-","_")}.csv`

    a.download = fname;
    // Append anchor to body.
    document.body.appendChild(a);
    a.click();

    // Remove anchor from body
    document.body.removeChild(a);

}
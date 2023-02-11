
function writeExportButton() {

    let table = document.getElementById("gameTable");
    let title = table.firstElementChild

    let exportButton = document.createElement("button"); 

    let lineBreak = document.createElement("br"); 

    exportButton.setAttribute("id","exportButton");
    exportButton.setAttribute("onclick","exportToCSV()");

    exportButton.innerText = "Export To CSV";

    title.appendChild(lineBreak);
    title.appendChild(exportButton);

}

function exportToCSV() {


    let gameTableDiv = document.getElementById('gameTable');

    let gameTable = gameTableDiv.querySelector("table")

    var csv_data = [];
 
    // Get each row data
    var rows = gameTable.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
 
        // Get each column data
        var cols = rows[i].querySelectorAll('td,th');
 
        // Stores each csv row data
        var csvrow = [];
        for (var j = 0; j < cols.length; j++) {
 
            // Get the text data of each cell of
            // a row and push it to csvrow
            csvrow.push(cols[j].innerHTML);
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

    a.download = 'chess_com_data.csv';
    // Append anchor to body.
    document.body.appendChild(a);
    a.click();

    // Remove anchor from body
    document.body.removeChild(a);

}
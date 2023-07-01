<template>
    <button 
    type="button" 
    id="exportExploreBtn" 
    class="btn btn-primary" 
    @click="onClickExportButton()"
    >
        <font-awesome-icon :icon="['fas', 'file-export']" />
        Export 
    </button>
</template>

<script>
    export default {
        name: "ExportBtn",
        methods: {
            onClickExportButton() {
                let userName = "";
                userName = window.localStorage.getItem('userName');

                let fileName = userName + "_dataExport.csv";

                this.downloadTableAsCSV('exploreTable', fileName);

            },
            downloadTableAsCSV(tableID, filename) {
                let table = document.getElementById(tableID);
                let rows = Array.from(table.querySelectorAll('tr'));
                let csvContent = '';
                
                // loop through each table row
                for (let i = 0, row; row = rows[i]; i++) {
                    let cols = Array.from(row.querySelectorAll('td, th'));
                    
                    for (let j = 0, col; col = cols[j]; j++) {
                        csvContent += '"' + col.innerText.replace(/"/g, '""') + '"';
                        if (j < cols.length - 1) {
                            csvContent += ',';
                        }
                    }
                    csvContent += '\n';
                }
                
                // create a blob
                let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                
                if (navigator.msSaveBlob) { // IE 10+
                    navigator.msSaveBlob(blob, filename);
                } else {
                    let link = document.createElement("a");
                    if (link.download !== undefined) { // feature detection
                        // Browsers that support HTML5 download attribute
                        let url = URL.createObjectURL(blob);
                        link.setAttribute("href", url);
                        link.setAttribute("download", filename);
                        link.style.visibility = 'hidden';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                }
            }

        }
    }
</script>

<style>
#exportExploreBtn
 {
    background-color: #85a35a;
    color: #ffffff;
    border: none;
    font-weight: bold;
    box-shadow: 0 5px 12px -2px rgba(0, 0, 0, 0.3);
}

#exportExploreBtn:hover
 {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    z-index: 1;
}

</style>
<template>

    <!-- export modal -->
    <div class="modal fade" id="exportModal" tabindex="-1" aria-labelledby="export modal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exportModalTitle">
                        For more info about export data <a
                            href="https://github.com/NotJoeMartinez/chess-insights#available-data" target="_blank">click
                            here</a>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <ul>
                        <li><b>Everything:</b> all available data to csv</li>
                        <li><b>Simplified:</b> date, timeClass, result, rating and gameUrl</li>
                        <li><b>PGN:</b> <a href="https://en.wikipedia.org/wiki/Portable_Game_Notation"
                                target="_blank">Portable Game Notation</a></li>
                        <li><b>JSON: </b><a href="https://en.wikipedia.org/wiki/JSON" target="_blank">Javascript Object
                                Notation</a></li>
                        <li><b>Custom:</b> Select what data to export</li>
                    </ul>
                </div>
                <div class="modal-footer">

                    <div class="row">
                        <button type="button" class="btn btn-primary export-option mb-1"
                            @click="exportData('all')">Everything (.csv)</button>
                        <button type="button" class="btn btn-primary export-option mb-1"
                            @click="exportData('simple')">Simplified (.csv)</button>
                        <button type="button" class="btn btn-primary export-option mb-1" @click="exportData('pgn')">PGN
                            (.pgn)</button>
                        <button type="button" class="btn btn-primary export-option mb-1"
                            @click="exportData('json')">JSON (.json)</button>
                        <button type="button" id="custom-export-btn" data-bs-toggle="modal"
                            data-bs-target="#custom-export-modal" class="btn btn-primary export-option mb-1"
                            @click="viewCustomExport()">Custom</button>

                    </div>

                </div>
            </div>
        </div>
    </div>
    <!-- custom export modal -->
    <div class="modal fade" id="custom-export-modal" tabindex="-1" aria-labelledby="custom export modal"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="customExportTitle">
                        Custom export
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body" id="customExportBody">

                </div>

                <div class="modal-footer">
                    <div class="row">
                        <button type="button" class="btn btn-primary export-option mb-1"
                            @click="customExport()">Export</button>
                    </div>


                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        exportChessData,
        makeCustomExport,
        showCustomExport
    } from '@/scripts/exportUtils.js'

    export default {
        name: "ExportPopup",
        methods: {
            exportData(option) {
                exportChessData(option);
            },
            viewCustomExport() {
                showCustomExport();
            },
            customExport() {
                makeCustomExport();
            }
        }
    }
</script>

<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title id="title">Free chess.com Insights</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" 
    rel="stylesheet" 
    integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" 
    crossorigin="anonymous">

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" 
    integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" 
    crossorigin="anonymous">
    </script>

    <!-- Chart JS  -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <!-- Custom CSS -->
    <link href="css/main.css" rel=stylesheet>

    <!-- Custom JS -->
    <script src="js/utils.js"></script>
    <script src="js/parseGameNode.js"></script>
    <script src="js/writeData.js"></script>
    <script src="js/main.js"></script>
    <script src="js/export.js"></script>
    <script src="js/graphics.js"></script>
  </head>
  <body>

  <div id="app">
        <div id="main">
          <?php require('nav.php'); ?>
            <header>
                <div class="container header-section">
                    <img id="chesslogo"
                        src="imgs/chesslogo.png"
                        width="300">
                    <h1>Free Chess.com Insights</h1>
                    <p style="text-align:center">Enter your chess.com username to generate a full export of your games</p>
                    <div class="input-group input-group-lg input-group--username">
                 

                        <input type="text" placeholder="Username"
                            id="username"
                            aria-describedby="u-addon" 
                            autocapitalize="none" 
                            autocorrect="off"
                            class="form-control username-input"> 
                        <span class="input-group-prepend">
                        <button type="button"
                                class="btn btn-secondary"
                                id="button"
                                onclick="getAllUserData()">
                                Get Insights 
                        </button>
                        </span>

                    </div>
                </div>
            </header>

            </div>
        </div>
    </div>
<!-- Export Modal -->
<div class="modal fade" id="exportModal" tabindex="-1" aria-labelledby="export modal" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exportModalTitle">
          For more info about export data <a href="https://github.com/NotJoeMartinez/chess-insights#available-data" target="_blank">click here</a>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <ul>
          <li><b>Everything:</b> all available data to csv</li>
          <li><b>Simplified:</b> date, timeClass, result, rating and gameUrl</li>
          <li><b>PGN:</b> <a href="https://en.wikipedia.org/wiki/Portable_Game_Notation" target="_blank">Portable Game Notation</a></li>
          <li><b>JSON: </b><a href="https://en.wikipedia.org/wiki/JSON" target="_blank">Javascript Object Notation</a></li>
          <li><b>Custom:</b> Select what data to export</li>
        </ul>
      </div>
      <div class="modal-footer">

        <div class="row">
            <button type="button" class="btn btn-primary export-option mb-1" onclick="exportData('all')">Everything (.csv)</button>
            <button type="button" class="btn btn-primary export-option mb-1" onclick="exportData('simple')">Simplified (.csv)</button>
            <button type="button" class="btn btn-primary export-option mb-1" onclick="exportData('pgn')">PGN (.pgn)</button>
            <button type="button" class="btn btn-primary export-option mb-1" onclick="exportData('json')">JSON (.json)</button>
            <button type="button" id='custom-export-btn' data-bs-toggle='modal' data-bs-target="#custom-export-modal" class="btn btn-primary export-option mb-1" onclick='showCustomExport()'>Custom</button>

      </div>

      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="custom-export-modal" tabindex="-1" aria-labelledby="custom export modal" aria-hidden="true">
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
            <button type="button" class="btn btn-primary export-option mb-1" onclick="makeCustomExport()">Export</button>
      </div>


      </div>
    </div>
  </div>
</div>



  </div>


  </body>
</html>


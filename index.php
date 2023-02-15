
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title id="title"></title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" 
    rel="stylesheet" 
    integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" 
    crossorigin="anonymous">


    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>


    <link href="css/main.css" rel=stylesheet>

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
            <header>
                <div class="container header-section"><img
                        src="imgs/chesslogo.png"
                        width="300">
                    <h1>Free Chess.com Insights</h1>
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
    </div>
  </div>


  </body>
</html>


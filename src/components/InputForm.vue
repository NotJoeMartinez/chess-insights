<template>
  <header>  
  <div class="container header-section">
    <img id="chesslogo"
                        src="../assets/chesslogo.png"
                        width="300">
    <h1>Free Chess.com Insights</h1>
    <p style="text-align:center">Enter your chess.com username to generate a full export of your games</p>

    <div class="input-group input-group-lg input-group--username">
                        <input type="text" placeholder="Username"
                            list="gmsList"
                            id="uname"
                            aria-describedby="u-addon" 
                            autocapitalize="none" 
                            autocorrect="off"
                            v-model="userName"
                            class="form-control username-input"
                            > 
                        <span class="input-group-prepend">
                          <button type="submit"
                                  class="btn btn-secondary"
                                  id="unameBtn"
                                  @click="submitForm()">
                                  Get Insights 
                          </button>
                          <button type="button"
                                  class="btn btn-secondary"
                                  id="uploadBtn"
                                  data-bs-toggle="tooltip" 
                                  data-bs-placement="top" 
                                  title="Upload json file"
                                  @click="uploadFile()">
                                  <font-awesome-icon :icon="['fas', 'file-arrow-up']" />
                          </button>

                      </span>

    </div>

  </div>
  <datalist id="gmsList">
</datalist>
</header>


</template>

<script>
import * as bootstrap from 'bootstrap'
export default {
  data() {
    return {
      userName: '',
    }
  },
  mounted() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
    })
  

    this.suggestUserInput();
  },
  methods: {
    submitForm() {
      this.$emit('get-all-user-data', this.userName);
    },
    uploadFile() {
      this.openFilePicker();
    },
    openFilePicker() {
      let inputElement = document.createElement("input");
      inputElement.type = "file";
      inputElement.accept = ".json";
      inputElement.click();

      inputElement.addEventListener("change", function () {
        if (this.files.length > 0) {
          console.log("Filename ", this.files[0].name);
          
          let reader = new FileReader();
          reader.onload = function(event) {
            try {
              let json = JSON.parse(event.target.result);
              console.log(json);
            } catch(e) {
              console.error("The file could not be parsed as JSON.", e);
            }
          };

          reader.onerror = function() {
            console.error("There was an error reading the file.");
          };
          
          reader.readAsText(this.files[0]);
        }
      });
    },
    suggestUserInput() {
      const input = document.getElementById("uname");
      const gms = [
        "mastoblood",
        "ajseventeen",
        "slimshaneyyy",
        "betterideas",
        "SvenskaRullstolen",
        "Dolols",
        "micbear1",
        "RedPanda1705",
      ];

      const randGms = gms
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

      const gmsDatalist = document.getElementById("gmsList");

      for (let i = 0; i < gms.length; i++) {
        const option = document.createElement("option");
        option.setAttribute("value", gms[i]);
        gmsDatalist.appendChild(option);
      }

      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      function tabDown(e) {
        if (e.key === "Tab") {
          e.preventDefault();
          const placeholder = input.getAttribute("placeholder");
          input.value = placeholder;
        }
      }

      input.addEventListener("keydown", tabDown);
      

      function enterDown(e) {
        if (e.key === "Enter") {
          this.userName = input.value;
          this.submitForm();
        }
      }
      input.addEventListener("keydown", enterDown.bind(this));
      
      function clearPlaceholder() {
        input.removeAttribute("placeholder");
      }

      function checkInput() {
        return input.value !== "";
      }

      async function suggestInput() {
        /* eslint-disable no-constant-condition */
        while (true) {
          for (let i = 0; i < randGms.length; i++) {
            if (checkInput()) {
              clearPlaceholder();
              return;
            } else {
              input.removeAttribute("placeholder");
              void input.offsetWidth;
              input.setAttribute("placeholder", randGms[i]);
              await sleep(3000);
            }
          }
        }
      }

      suggestInput();
      }
  },
}
</script>

<style>
#uploadBtn {
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-color: #85a35a;
  color: #ffffff;
  border: none;
  font-weight: bold;
  box-shadow: 0 5px 12px -2px rgba(0, 0, 0, 0.3);
}

#uploadBtn:hover{
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    z-index: 1;
}

</style>
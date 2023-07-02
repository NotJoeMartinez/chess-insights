<template>
  <header>  
  <div class="container header-section">
    <img id="chesslogo"
                        src="../assets/chesslogo.png"
                        width="300">
    <h1>Free Chess.com Insights</h1>
    <p style="text-align:center">Enter your chess.com username to generate a full export of your games.</p>

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
                                  @click="uploadFile">
                                  <font-awesome-icon :icon="['fas', 'file-arrow-up']" />
                          </button>

                      </span>

    </div>

  <div> 
  </div>
  </div>  
  <datalist id="gmsList">
</datalist>
</header>


</template>

<script>
import { importJsonData } from '~/utils/userImports.js';


export default {
  data() {
    return {
      userName: '',
    }
  },
  mounted() {
    // let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    // let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    // return new bootstrap.Tooltip(tooltipTriggerEl)
    // })
  
    this.suggestUserInput();
  },
  methods: {
    submitForm() {
      this.$emit('get-all-user-data', this.userName);
    },

    uploadFile() {

      let inputElement = document.createElement("input");
      inputElement.type = "file";
      inputElement.accept = ".json";
      inputElement.click();

      inputElement.addEventListener("change", (event) => {
        if (event.target.files.length > 0) {
          let reader = new FileReader();
          reader.onload = (event) => {
            try {
              let json = JSON.parse(event.target.result);
              importJsonData(json);
              this.$emit('read-file-upload');
            } catch(e) {
              alert("The file could not be parsed as JSON. Please read documentation for more information.");
              console.error("The file could not be parsed as JSON.", e);
            }
          };

          reader.onerror = function() {
            alert("There was an error reading the file. Please read documentation for more information.")
            console.error("There was an error reading the file.");
          };
          
          reader.readAsText(event.target.files[0]);
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
.form-control::placeholder {
  color: rgba(200, 206, 212, 0.75);
  opacity: 1;

}
#uname {
  color: #ffffff !important;
}
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
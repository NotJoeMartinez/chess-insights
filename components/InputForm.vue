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

  <dialog id="invalidUser">
    <h4>
      <strong>Invalid User </strong>
    </h4>
    
    <p>
      {{ userName }}
    </p>
    <button id="closeInvalidUserBtn" @click="closeResetModal">Close</button>
  </dialog>
</header>


</template>

<script>
import { importJsonData } from '~/utils/userImports.js';

export default {
  data() {
    return {
      userName: '',
      invalidUser: false
    }
  },
  mounted() {
    this.suggestUserInput();
  },
  methods: {
    async submitForm() {
      

      let res = null;
      try {
        res = await fetch(`https://api.chess.com/pub/player/${this.userName}`);
      } catch (e) {
        this.invalidUser = true;
        this.triggerInvalidUserModal();
      }

      if (res !== null && res.status === 200) {
        this.$emit('get-all-user-data', this.userName);
      } else {
        this.invalidUser = true;
        this.triggerInvalidUserModal();
      }

    },
    closeResetModal() {
      let modal = document.getElementById('invalidUser')
      modal.close();
      this.invalidUser = false;
      this.userName = '';
    },
    triggerInvalidUserModal() {
      let modal = document.getElementById('invalidUser')
      modal.showModal();
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
        "nowhere2b",
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


#invalidUser {
  background-color: #312e2b; 
  color: #ffffff; 
  
  border-style: solid;
  border-color: #a94442; 
  border-width: 0 0 0 5px;
  
  border-radius: 4px; 
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2); 
  
  padding: 10px 15px; 
  font-family: sans-serif; 
  font-size: 0.9em; 
  
}


#closeInvalidUserBtn {
  background-color: #505050; 
  color: #ffffff; 
  
  border: none; 
  border-radius: 2px; 
  
  padding: 5px 10px; 
  cursor: pointer; 
  
  font-family: inherit; 
}

#closeInvalidUserBtn:hover {
  background-color: #606060; 
}

</style>
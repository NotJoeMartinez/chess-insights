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
                      </span>

    </div>

  </div>
  <datalist id="gmsList">
</datalist>
</header>


</template>

<script>
export default {
  data() {
    return {
      userName: '',
    }
  },
  mounted() {
    this.suggestUserInput();
  },
  methods: {
    submitForm() {
      this.$emit('get-all-user-data', this.userName);
    },
    suggestUserInput() {
      const input = document.getElementById("uname");
      const gms = [
        "lachesisq",
        "magnuscarlsen",
        "chefshouse",
        "gmwso",
        "fabianocaruana",
        "sergeykarjakin",
        "grischuk",
        "sebastian",
        "azerichess",
        "lyonbeast"
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


let gms = ["lachesisq", "magnuscarlsen", "chefshouse", "gmwso", "fabianocaruana", "sergeykarjakin", "grischuk", "sebastian", "azerichess", "lyonbeast"];


let randGms = gms.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);


let gmsDatalist = document.getElementById("gmsList");
for(let i=0; i<gms.length; i++){
    let option = document.createElement("option");
    option.setAttribute("value", gms[i]);
    gmsDatalist.appendChild(option);
}


let input = document.getElementById("inputUsername");

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

function tabDown(e) {
    if (e.key == "Tab"){
        placeholder = input.getAttribute("placeholder");
        input.setAttribute("value", placeholder);
    }
}

function checkInput(){
    if (input.value !=""){
        return true;
    }
    else {
        return false;
    }

} 

function clearPlaceHolder(){
    input.removeAttribute("placeholder");
}

input.addEventListener('keydown', tabDown);

async function suggestInput() {
      while (true) {
        for (let i=0; i<randGms.length; i++) {
            if (checkInput()){
                clearPlaceHolder();
                return;
            }
            else {
                input.removeAttribute('placeholder');
                void input.offsetWidth;
                input.setAttribute("placeholder",randGms[i]);
                await sleep(3000);   
            }
        }
        // if (checkInput()){
        //     clearPlaceHolder();
        //     return;
        // }
      }
  }

suggestInput();

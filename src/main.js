
// // Bootstrap
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/js/bootstrap.js';

// // custom css
// import './assets/main.css';
// import './assets/buttons.css';

// //  Font Awesome
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { fas } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


// //routing 
// import { store } from './store.js';
// import router from './router/router.js';

// import { createApp } from 'vue';
// import App from './App.vue';

// // make app object
// const app = createApp(App);

// // add font awesome
// library.add(fas);
// app.component('font-awesome-icon', FontAwesomeIcon);



// // Mount
// app.use(router).use(store).mount('#app');

import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './assets/main.css';
import './assets/buttons.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { store } from './store'; // <-- Import your store correctly
import router from './router/router.js';

// make app object
const app = createApp(App);

// add font awesome
library.add(fas);
app.component('font-awesome-icon', FontAwesomeIcon);

// Mount
app.use(router).use(store).mount('#app');

// import { createApp } from 'vue'
// import App from './App.vue'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap/dist/js/bootstrap.js';
// import './assets/main.css'
// import router from './router/router.js'


// createApp(App).use(router).mount('#app')

import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './assets/main.css';
import './assets/buttons.css';
import router from './router/router.js';

//  Font Awesome p
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(fas);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);


// Mount
app.use(router).mount('#app');
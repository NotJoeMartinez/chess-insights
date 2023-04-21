
import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './assets/main.css';
import './assets/buttons.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import router from './router/router.js';

// make app object
const app = createApp(App);

// add font awesome
library.add(fas);
app.component('font-awesome-icon', FontAwesomeIcon);

// Mount
app.use(router).mount('#app');

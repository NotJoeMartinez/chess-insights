
import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '@/pages/HomePage.vue'
import ExplorePage from '@/pages/ExplorePage.vue'

const routes = [
    {'path': '/', component: HomePage},
    {'path': '/explore', component: ExplorePage},
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;


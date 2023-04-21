
import { createRouter, createWebHistory } from 'vue-router';

import RouteFoo from '@/components/RouteFoo.vue'
import RouteBar from '@/components/RouteBar.vue'
import HomePage from '@/components/HomePage.vue'

const routes = [
    {'path': '/', component: HomePage},
    {'path': '/foo', component: RouteFoo},
    {'path': '/bar', component: RouteBar}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;


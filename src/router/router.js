import {
    createRouter,
    createWebHistory
} from 'vue-router';

import HomePage from '@/pages/HomePage.vue'
import ExplorePage from '@/pages/ExplorePage.vue'
import AboutPage from '@/pages/AboutPage.vue'

const routes = [{
        'path': '/',
        component: HomePage
    },
    {
        'path': '/explore',
        'name': 'Explore',
        component: ExplorePage
    },
    {
        'path': '/about',
        'name': 'About',
        component: AboutPage
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;
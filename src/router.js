
import { createRouter, createWebHistory } from 'vue-router';

import RouteFoo from './components/RouteFoo.vue';
import RouteBar from './components/RouteBar.vue'
import InputForm from './components/InputForm.vue'
import UserOverview from './components/UserOverview.vue'
import EloOverTime from './components/EloOverTime.vue'
import ProgBar from './components/ProgBar.vue'
import OpeningGraph from './components/OpeningGraph.vue'
import WinChart from './components/WinChart.vue'
import LossChart from './components/LossChart.vue'
import ExportData from './components/ExportData.vue'

const routes = [
    {'path': '/', component: InputForm},
    {'path': '/foo', component: RouteFoo},
    {'path': '/bar', component: RouteBar}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;


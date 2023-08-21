import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import vuetify from './plugins/vuetify';
import '@/scss/style.scss';
import PerfectScrollbar from 'vue3-perfect-scrollbar';
import VueApexCharts from 'vue3-apexcharts';
import VueTablerIcons from 'vue-tabler-icons';
import Maska from 'maska';

createApp(App)
.use(router)
.use(PerfectScrollbar)
.use(VueTablerIcons)
.use(Maska)
.use(VueApexCharts)
.use(vuetify)
.mount('#app')
.$nextTick(() => postMessage({ payload: 'removeLoading' }, '*'))

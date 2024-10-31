import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import vuetify from "./plugins/vuetify";
import VueApexCharts from "vue3-apexcharts";
import VueTablerIcons from "vue-tabler-icons";
import Maska from "maska";
import { setupCalendar } from "v-calendar";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { PerfectScrollbarPlugin } from "vue3-perfect-scrollbar";
import "vue3-perfect-scrollbar/style.css";

createApp(App)
.use(router)
.use(PerfectScrollbarPlugin)
.use(VueTablerIcons)
.use(Maska)
.use(VueApexCharts)
.use(vuetify)
.use(setupCalendar,{})
.component("VueDatePicker", VueDatePicker)
.mount("#app")
.$nextTick(() => postMessage({ payload: "removeLoading" }, "*"));

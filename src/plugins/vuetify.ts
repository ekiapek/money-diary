import { createVuetify } from "vuetify";
// import "vuetify/styles";
import "@/scss/style.scss";
import "@mdi/font/css/materialdesignicons.css";
import * as directives from "vuetify/directives";
import * as components from "vuetify/components";
import { PurpleTheme } from "@/theme/LightTheme";
import DayJsAdapter from "@date-io/dayjs";

export default createVuetify({
    directives,
    components,
    theme: {
        defaultTheme: "PurpleTheme",
        themes: {
            PurpleTheme,
        }
    },
    defaults: {
        VBtn: {},
        VCard: {
            rounded: "md"
        },
        VTextField: {
            rounded: "lg"
        },
        VTooltip: {
            // set v-tooltip default location to top
            location: "top"
        }
    },
    date: {
        adapter: DayJsAdapter,
      }
});

import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { PurpleTheme} from '@/theme/LightTheme';
import { VDatePicker } from 'vuetify/labs/components';
import DayJsAdapter from '@date-io/dayjs';

export default createVuetify({
    components:{
        VDatePicker,
    },
    directives,

    theme: {
        defaultTheme: 'PurpleTheme',
        themes: {
            PurpleTheme,
        }
    },
    defaults: {
        VBtn: {},
        VCard: {
            rounded: 'md'
        },
        VTextField: {
            rounded: 'lg'
        },
        VTooltip: {
            // set v-tooltip default location to top
            location: 'top'
        }
    },
    date: {
        adapter: DayJsAdapter,
      }
});

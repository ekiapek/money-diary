<template>
    <v-menu v-model="filterMenu" :close-on-content-click="false" :nudge-right="40" lazy transition="scale-transition"
        offset-y>
        <template v-slot:activator="{ props }">
            <v-chip prepend-icon="mdi-filter-variant" v-bind="props" style="min-width: 80px;">Filter</v-chip>
        </template>
        <v-card class="pa-2" min-width="300px" min-height="150px" max-width="500px">
            <v-row class="mx-3 mt-5 mb-3">
                <MonthPicker v-model="filterDate" />
            </v-row>
            <v-row class="mx-3" justify="end">
                <v-btn variant="tonal" rounded="xl" style="color: rgb(var(--v-theme-primary));" @click="saveFilter()">Apply</v-btn>
            </v-row>
        </v-card>
    </v-menu>
</template>
<script lang="ts">
import MonthPicker from '../date/MonthPicker.vue';
import {FilterOptions} from '../../types/Filter.ts';
import dayjs from 'dayjs';
export default {
    components: {
        MonthPicker,
    },
    data() {
        return {
            filterMenu: false,
            filterDate: new Date(),
        };
    },
    methods:{
        saveFilter(){
            let filterOpts:FilterOptions = {};
            if (this.filterDate !== undefined) {
                let date = dayjs(this.filterDate);
                filterOpts.startDate = date.set('date',1).toDate();
                filterOpts.endDate = date.set('date',date.daysInMonth()).toDate();
            }
            this.$emit("setFilter",filterOpts);
        }
    }
};
</script>
<template>
    <v-menu v-model="filterMenu" :close-on-content-click="false" :nudge-right="40" lazy transition="scale-transition"
        offset-y>
        <template v-slot:activator="{ props }">
            <v-chip prepend-icon="mdi-filter-variant" v-bind="props" style="min-width: 80px;">Filter</v-chip>
        </template>
        <v-card class="px-5 pb-5 pt-2" min-width="300px" min-height="150px" max-width="700px">
            <v-col>
                <v-row class="mt-1 mb-6">
                    <MonthPicker v-model="filterDate" />
                </v-row>
                <v-row class="">
                    <v-select v-model="selectedWallet" variant="outlined" label="Select Wallet" item-value="id"
                        item-title="name" :items="wallets" :menu-props="{ maxHeight: '200px' }">
                        <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props" :title="item?.raw?.name" :subtitle="item?.raw?.currency">
                                <template v-slot:prepend>
                                    <v-avatar class="text-white" variant="flat" :color="item?.raw?.color">
                                        <span class="text-h4">{{ item?.raw?.icon }}</span>
                                    </v-avatar>
                                </template>
                            </v-list-item>
                        </template>
                    </v-select>
                </v-row>
                <v-row class="">
                    <v-select v-model="selectedCategory" variant="outlined" label="Select Category" item-value="id"
                        item-title="name" :items="categories" :menu-props="{ maxHeight: '200px' }">
                        <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props" :title="item?.raw?.name">
                                <template v-slot:prepend>
                                    <v-avatar class="text-white" variant="flat" :color="item?.raw?.color">
                                        <span class="text-h4">{{ item?.raw?.icon }}</span>
                                    </v-avatar>
                                </template>
                            </v-list-item>
                        </template>
                    </v-select>
                </v-row>
                <v-row class="" justify="end">
                    <v-btn variant="tonal" rounded="xl" style="color: rgb(var(--v-theme-error));"
                        @click="resetFilter()">Clear</v-btn>
                    <v-btn variant="tonal" rounded="xl" style="color: rgb(var(--v-theme-primary));"
                        @click="saveFilter()">Apply</v-btn>

                </v-row>
            </v-col>
        </v-card>
    </v-menu>
</template>
<script lang="ts">
import MonthPicker from "../date/MonthPicker.vue";
import { TransactionFilter } from "../../types/Filter.ts";
import dayjs from "dayjs";
export default {
    components: {
        MonthPicker,
    },
    props: {
        date: Date,
        wallets: Array,
        categories: Array,
    },
    data() {
        return {
            filterMenu: false,
            filterDate: this.date ? this.date : new Date(),
            selectedWallet: undefined,
            selectedCategory: undefined,
        };
    },
    methods: {
        saveFilter() {
            let filterOpts: TransactionFilter = {};
            if (this.filterDate !== undefined) {
                let date = dayjs(this.filterDate);
                filterOpts.startDate = date.set("date", 1).toDate();
                filterOpts.endDate = date.set("date", date.daysInMonth()).toDate();
            }

            filterOpts.walletId = this.selectedWallet;
            filterOpts.categoryId = this.selectedCategory;

            this.$emit("setFilter", filterOpts);
            this.filterMenu = false;
        },
        resetFilter() {
            this.filterDate = new Date();
            this.selectedWallet = undefined;
            this.selectedCategory = undefined;
        }
    }
};
</script>
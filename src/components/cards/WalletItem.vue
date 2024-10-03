<script setup lang="ts">
import { Wallet } from '@/types/models/Wallet';
import { PropType } from 'vue';
import { formatCurrency } from '@/util/currency';
const props = defineProps({
    wallet: Wallet as PropType<Wallet>
})

let balance = props.wallet?.balance ?? 0;
let currency = props.wallet?.currency ?? "USD";
</script>
<template>
    <v-card class="py-3 pr-3 d-flex align-center" elevation="10" height="100%">
        <v-row no-gutters class="align-center">
            <v-col class="d-flex justify-center">
                <v-avatar size="x-large" height="100%" class="text-white" variant="flat" :color="wallet?.color">
                    <span class="text-h2">{{ wallet?.icon }}</span>
                </v-avatar>
            </v-col>
            <v-col xl="9" lg="8" md="7" sm="7">
                <h4 style="overflow-wrap: break-all; word-break: break-word;">
                    {{ wallet?.name }}
                </h4>
                <h4>{{ formatCurrency(balance, currency) }}</h4>
                <p>{{ wallet?.type + " Wallet" }}</p>
            </v-col>
        </v-row>
    </v-card>
</template>
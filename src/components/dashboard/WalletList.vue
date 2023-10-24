<script setup lang="ts">
import { formatCurrency } from '@/util/currency';
const props = defineProps({
    wallets:[]
})
</script>
<template>
    <v-card elevation="10" class="withbg">
        <v-card-item>
            <div class="d-sm-flex align-center justify-space-between pt-sm-2">
                <div><v-card-title class="text-h5">My Wallets</v-card-title></div>
            </div>
            <div class="mt-6">
                <div v-if="props.wallets!==undefined && props.wallets.length > 0">
                        <div v-for="item in props.wallets" :key="item.id">
                            <v-container class="py-3 px-4">
                                <v-row class="align-center" justify="start">
                                    <v-avatar class="text-white" variant="flat" :color="item.color">
                                    <span class="text-h4">{{ item.icon }}</span>
                                    </v-avatar>
                                <v-col class="mx-2">
                                    <h4>{{ item.name }} </h4>
                                    <h5>{{ item.type + " Wallet" }}</h5>
                                    <p>{{ formatCurrency(item.balance,item.currency) }}</p>
                                </v-col>
                                </v-row>
                            </v-container>
                        </div>
                </div>
                <p v-else><i>No data</i></p>
            </div>
        </v-card-item>
    </v-card>
</template>
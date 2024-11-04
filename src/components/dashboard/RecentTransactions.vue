<script setup lang="ts">
import { formatCurrency } from "@/util/currency";
import { PropType } from "vue";
const props = defineProps({
    transactions:Array as PropType<any[]>
});
</script>
<template>
    <v-card elevation="3" class="withbg">
        <v-card-item class="pb-0">
            <v-card-title class="text-h5 pt-sm-2">Recent Transactions</v-card-title>
            <div class="mb-3">
                <div class="mt-6">
                <div class="px-3" v-if="props.transactions !== undefined && props.transactions.length > 0" >
                    <v-table>
                        <thead>
                        <tr>
                            <th class="text-subtitle-1 font-weight-bold">Category</th>
                            <th class="text-subtitle-1 font-weight-bold">Amount</th>
                            <th class="text-subtitle-1 font-weight-bold">Type</th>
                            <th class="text-subtitle-1 font-weight-bold">Description</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in props.transactions" :key="item.id" class="trx-row">
                            <td>
                            <div class="">
                                <v-avatar class="text-white" variant="flat" :color="item.category.color">
                                <span class="text-h4">{{ item.category.icon }}</span>
                                </v-avatar>
                                <span class="text-subtitle-1 font-weight-bold ml-3">{{ item.category.name }}</span>
                                <!-- <div class="text-13 mt-1 text-muted">{{ item.post }}</div> -->
                            </div>
                            </td>
                            <td>
                            <h6 class="text-body-1 text-muted">{{ formatCurrency(item.amount, item.wallet.currency) }}</h6>
                            </td>
                            <td>
                            <v-chip v-if="item.type == 1" :class="'text-body-1 bg-success'" color="white"
                                size="small">Income</v-chip>
                            <v-chip v-else-if="item.type == 2" :class="'text-body-1 bg-warning'" color="white" size="small">Transfer</v-chip>
                            <v-chip v-else :class="'text-body-1 bg-error'" color="white" size="small">Spending</v-chip>
                            </td>
                            <td style="max-width: 300px;">
                            <p class="d-inline-block text-truncate" style="max-width: inherit;">{{ item.description }}</p>
                            </td>   
                        </tr>
                        </tbody>
                    </v-table>
                </div>
                <div v-else>
                    <p><i>No data</i></p>
                </div>
            </div>
            </div>
        </v-card-item>
    </v-card>
</template>

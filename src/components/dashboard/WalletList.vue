<script setup lang="ts">
import { formatCurrency } from '@/util/currency';
import { PropType } from 'vue';
const props = defineProps({
    wallets: Array as PropType<any[]>
})
</script>
<template>
    <v-card elevation="10" class="withbg">
        <v-card-item>
            <div class="d-sm-flex align-center justify-space-between pt-sm-2">
                <div><v-card-title class="text-h5">My Wallets</v-card-title></div>
            </div>
            <div class="mt-6">

                <div class="px-3" v-if="props.wallets !== undefined && props.wallets.length > 0">
                    <v-table >
                        <tbody>
                            <tr v-for="item in props.wallets" :key="item.id">
                                <td>
                                    <div class="">
                                        <v-avatar class="text-white" variant="flat" :color="item?.color">
                                            <span class="text-h4">{{ item?.icon }}</span>
                                        </v-avatar>
                                        <span class="text-h5 font-weight-bold ml-3">{{ item?.name }}</span>
                                       
                                    </div>
                                </td>
                                <td>
                                    <p>{{ item?.type + " Wallet" }}</p>
                                </td>
                                <td>
                                    <h4>{{ formatCurrency(item?.balance, item?.currency) }}</h4>
                                </td>
                                
                            </tr>
                        </tbody>
                    </v-table>
                    <!-- <v-col v-for="item in props.wallets" :key="item.id">
                        <v-card variant="outlined" class="px-3" style="min-width: 240px;">
                            <v-container class="py-3 px-4">
                                <v-row class="align-center" justify="start">
                                    <v-col class="d-flex justify-center">
                                        <v-avatar size="x-large" height="100%" class="text-white" variant="flat"
                                            :color="item?.color">
                                            <span class="text-h2">{{ item?.icon }}</span>
                                        </v-avatar>
                                    </v-col>
                                    <v-col xl="7" lg="7" md="6" sm="6">
                                        <h4 style="overflow-wrap: break-all; word-break: break-word;">
                                            {{ item?.name }}
                                        </h4>
                                        <h4>{{ formatCurrency(item?.balance, item?.currency) }}</h4>
                                        <p>{{ item?.type + " Wallet" }}</p>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card>
                    </v-col> -->
                </div>

                <div v-else>
                    <v-col class="align-top"><i>No data</i></v-col>
                </div>

            </div>
        </v-card-item>
    </v-card>
</template>
<style scoped>
.v-card--variant-outlined {
    border-color: rgb(227, 227, 227);
}
</style>
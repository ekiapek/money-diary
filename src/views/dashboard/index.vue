<template>
    <v-row>
        <v-col cols="12">
            <v-row class="align-center justify-space-between">
                <v-col>
                    <v-card elevation="10">
                        <v-card-item>
                            <div class="d-flex align-center">
                                <v-avatar size="large" color="primary" icon="mdi-cash-multiple"></v-avatar>
                                <v-card-title class="text-h5 ml-3">Total Funds</v-card-title>
                            </div>
                        </v-card-item>
                        <v-skeleton-loader :loading="isLoading" type="heading">
                            <v-card-text>
                                <div class="d-flex align-center justify-end">
                                    <h1>{{ totalFunds }}</h1>
                                </div>
                            </v-card-text>
                        </v-skeleton-loader>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card elevation="10">
                        <v-card-item>
                            <div class="d-flex align-center">
                                <v-avatar size="large" color="success" icon="mdi-currency-usd"></v-avatar>
                                <v-card-title class="text-h5 ml-3">Total Income This Month</v-card-title>
                            </div>
                        </v-card-item>
                        <v-skeleton-loader :loading="isLoading" type="heading">
                            <v-card-text>
                                <div class="d-flex align-center justify-end">
                                    <h1 class="text-success">{{ totalIncome }}</h1>

                                </div>
                            </v-card-text>
                        </v-skeleton-loader>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card elevation="10">
                        <v-card-item>
                            <div class="d-flex align-center">
                                <v-avatar size="large" color="error" icon="mdi-currency-usd"></v-avatar>
                                <v-card-title class="text-h5 ml-3">Total Spendings This Month</v-card-title>
                            </div>
                        </v-card-item>
                        <v-skeleton-loader :loading="isLoading" type="heading">
                            <v-card-text>
                                <div class="d-flex align-center justify-end">
                                    <h1 class="text-error">{{ totalSpendings }}</h1>
                                </div>
                            </v-card-text>
                        </v-skeleton-loader>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" lg="12">
                    <v-skeleton-loader :loading="isLoading" type="card">
                        <TransactionsChart v-if="spendingsChart !== undefined" title="Monthly Spendings" :chart-series="spendingsChart.data" :chart-colors="spendingsChart.colors" :chart-labels="spendingsChart.labels" />
                        <p v-else><i>No data</i></p>
                    </v-skeleton-loader>
                </v-col>
                <v-col cols="12" lg="8">
                    <v-skeleton-loader :loading="isLoading" type="card">
                        <TransactionsChart v-if="incomeChart !== undefined" title="Monthly Income" :chart-series="incomeChart.data" :chart-colors="incomeChart.colors" :chart-labels="incomeChart.labels" />
                        <p v-else><i>No data</i></p>
                    </v-skeleton-loader>
                </v-col>
                <v-col cols="12" lg="4">
                    <v-skeleton-loader :loading="isLoading" type="list-item-avatar-two-line@5">
                        <WalletList :wallets="wallets" />
                    </v-skeleton-loader>
                </v-col>
                <!-- Product Cards -->
                <v-col cols="12">
                    <v-skeleton-loader :loading="isLoading" type="table">
                        <RecentTransactions :transactions="recentTransaction" />
                    </v-skeleton-loader>
                </v-col>
            </v-row>
        </v-col>
        <!-- <v-col class="text-center mt-2">
            <p class="text-muted">Design and Developed by <a flat variant="text" href="https://adminmart.com/" target="_blank" class="pl-1 text-primary">AdminMart.com</a></p>
        </v-col> -->
    </v-row>
</template>
<script lang="ts">
import { formatCurrency } from '@/util/currency';
import TransactionsChart from '@/components/dashboard/TransactionsChart.vue';
import WalletList from '@/components/dashboard/WalletList.vue';
import RecentTransactions from '@/components/dashboard/RecentTransactions.vue';
export default {
    components:{
        "TransactionsChart":TransactionsChart,
        "WalletList":WalletList,
        "RecentTransactions":RecentTransactions
    },
    data() {
        return {
            totalIncome: "",
            totalSpendings: "",
            totalFunds: "",
            recentTransaction: [],
            wallets: [],
            incomeChart: undefined,
            spendingsChart: undefined,
            currency: "USD",
            isLoading: false,
        }
    },
    created() {
        this.loadData()
    },
    methods: {
        formatCurrency,
        loadData() {
            this.isLoading = true;
            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const paramJson = JSON.stringify({ start: startOfMonth, end: today });

            window.api.getDashboard(paramJson).then((dashboardData) => {
                
                this.isLoading = false;
                if (dashboardData) {
                    this.currency = dashboardData.currency;
                    this.totalFunds = formatCurrency(dashboardData.totalFund,this.currency);
                    this.totalIncome = formatCurrency(dashboardData.totalIncome,this.currency);
                    this.totalSpendings = formatCurrency(dashboardData.totalSpendings,this.currency);
                    this.recentTransaction = dashboardData.recentTransactions;
                    this.wallets = dashboardData.wallets;
                    this.incomeChart = dashboardData.incomeChart;
                    this.spendingsChart = dashboardData.spendingChart;
                }
            }).catch((error) => { console.log(error) })
        }
    }
}
</script>
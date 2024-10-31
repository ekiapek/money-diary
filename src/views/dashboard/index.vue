<template>
    <div>
        <v-row class="mb-3">
            <v-col cols="12">
                <v-row class="align-center justify-space-between">
                    <v-col>
                        <v-card elevation="3">
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
                        <v-card elevation="3">
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
                        <v-card elevation="3">
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
            </v-col>
        </v-row>
        <v-divider :thickness="2" class="border-opacity-100"></v-divider>
        <v-row class="pb-5">
            <v-col>   
                <v-row class="mb-3 mt-3 px-3 gx-5 flex-nowrap overflow-auto scrolling-month">             
                    <div v-for="month in generateMonths(minDate,maxDate)">
                        <v-chip class="mx-1" color="primary" variant="flat" v-if="month.date.getFullYear() == activePeriod.getFullYear() && month.date.getMonth() == activePeriod.getMonth()" @click.stop="getChartData(month.date)">{{month.str}}</v-chip>
                        <v-chip class="mx-1" v-else @click.stop="getChartData(month.date)">{{month.str}}</v-chip>
                    </div>
                </v-row>
                <v-row>
                    <v-col cols="12" lg="12">
                        <v-skeleton-loader :loading="isLoadingChart" type="card">
                            <TransactionsChart v-if="spendingsChart !== undefined" title="Monthly Spendings"
                                :chart-series="spendingsChart.data" :chart-colors="spendingsChart.colors"
                                :chart-labels="spendingsChart.labels" />
                            <TransactionsChart v-else title="Monthly Spendings" :chart-series="undefined"
                                :chart-colors="undefined" :chart-labels="undefined" />
                        </v-skeleton-loader>
                    </v-col>
                    <v-col cols="12" lg="12">
                        <v-skeleton-loader :loading="isLoadingChart" type="card">
                            <TransactionsChart v-if="incomeChart !== undefined" title="Monthly Income"
                                :chart-series="incomeChart.data" :chart-colors="incomeChart.colors"
                                :chart-labels="incomeChart.labels" />
                            <TransactionsChart v-else title="Monthly Income" :chart-series="undefined"
                                :chart-colors="undefined" :chart-labels="undefined" />
                        </v-skeleton-loader>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-divider :thickness="2" class="border-opacity-100"></v-divider>
        <v-row class="pt-5">
            <v-col>
                <v-row>
                    <v-col cols="12" lg="12">
                        <v-skeleton-loader :loading="isLoading" type="list-item-avatar-two-line@5">
                            <WalletList :wallets="wallets" />
                        </v-skeleton-loader>
                    </v-col>
                </v-row>
                <v-row>
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
    </div>
</template>
<script lang="ts">
import { generateMonths } from '@/util/monthGenerator';
import { formatCurrency } from '@/util/currency';
import TransactionsChart from '@/components/dashboard/TransactionsChart.vue';
import WalletList from '@/components/dashboard/WalletList.vue';
import RecentTransactions from '@/components/dashboard/RecentTransactions.vue';

export default {
    components: {
        "TransactionsChart": TransactionsChart,
        "WalletList": WalletList,
        "RecentTransactions": RecentTransactions
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
            isLoadingChart: false,
            minDate: new Date(),
            maxDate: new Date(),
            activePeriod: new Date(),
        }
    },
    created() {
        this.loadData()
    },
    methods: {
        generateMonths,
        formatCurrency,
        loadData() {
            this.isLoading = true;
            this.isLoadingChart = true;
            window.api.getDashboard().then((dashboardData) => {
                this.isLoading = false;
                this.isLoadingChart = false;
                if (dashboardData) {
                    this.currency = dashboardData.currency ? dashboardData.currency : this.currency;
                    this.totalFunds = formatCurrency(dashboardData.totalFund, this.currency);
                    this.totalIncome = formatCurrency(dashboardData.totalIncome, this.currency);
                    this.totalSpendings = formatCurrency(dashboardData.totalSpendings, this.currency);
                    this.recentTransaction = dashboardData.recentTransactions;
                    this.wallets = dashboardData.wallets;
                    
                    this.minDate = new Date(dashboardData.minDate);
                    this.maxDate = new Date(dashboardData.maxDate);
                    
                    if(dashboardData.chart !== undefined) {
                        this.incomeChart = dashboardData.chart.incomeChart;
                        this.spendingsChart = dashboardData.chart.spendingChart;
                    }
                }
            }).catch((error) => { console.log(error) })
        },
        getChartData(date:Date) {
            this.isLoadingChart = true;
            let startDate:Date = new Date(date.getFullYear(),date.getMonth(),1);
            let endDate:Date = new Date(date.getFullYear(),date.getMonth()+1,0);
            let req:any = JSON.stringify({startDate:startDate,endDate:endDate});            
            window.api.getChart(req).then((data) => {
                this.isLoadingChart = false;
                if (data) {
                    this.incomeChart = data.incomeChart;
                    this.spendingsChart = data.spendingChart;
                    this.activePeriod = data.period;
                } else {
                    this.incomeChart = undefined;
                    this.spendingsChart = undefined;
                    this.activePeriod = date;
                }
            })
        }
    }
}
</script>
<style scoped>
.v-chip.active{
    color: #5D87FF;
}

.scrolling-month::-webkit-scrollbar {
    display: none;
}
</style>
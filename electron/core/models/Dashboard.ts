import { Transaction } from "./Transaction";
import { Wallet } from "./Wallet";

export type DashboardResponse = {
    startPeriod?:Date,
    endPeriod?:Date,
    totalFund?:Number,
    totalIncome?:Number,
    totalSpendings?:Number,
    wallets?:Wallet[],
    recentTransactions?:Transaction[],
    spendingChart?: ChartData,
    incomeChart?: ChartData,
    currency?:string
}

export type ChartData = {
    labels:[],
    data:[],
    colors:[]
}
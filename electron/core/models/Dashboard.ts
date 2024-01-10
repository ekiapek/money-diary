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
    chart?: Charts,
    currency?:string,
    minDate?:Date,
    maxDate?:Date
}

export type Charts = {
    period: Date,
    spendingChart?: ChartData,
    incomeChart?: ChartData,
}

export type ChartData = {
    labels:[],
    data:[],
    colors:[]
}
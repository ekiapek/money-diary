import { Transaction } from "./Transaction";
import { Wallet } from "./Wallet";

export type DashboardResponse = {
    startPeriod?:Date,
    endPeriod?:Date,
    totalFund?:number,
    totalIncome?:number,
    totalSpendings?:number,
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
    labels:string[],
    data:any[],
    colors:string[]
}
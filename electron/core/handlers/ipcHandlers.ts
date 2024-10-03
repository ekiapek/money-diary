import { ipcMain } from "electron";
import { JsonDB } from "../util/db/json";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { CategoryUsecase } from "../usecases/CategoryUsecase";
import { Category } from "../models/Category";
import { WalletRepository } from "../repositories/WalletRepository";
import { TransactionRepository } from "../repositories/TrasactionRepository";
import { WalletUsecase } from "../usecases/WalletUsecase";
import { TransactionUsecase } from "../usecases/TransactionUsecase";
import { Wallet } from "../models/Wallet";
import { Transaction } from "../models/Transaction";
import { WALLET_TYPES, appDirectory } from "../common/constants";
import { logger } from "../util/logging/winston";
import { ChartData, Charts, DashboardResponse } from "../models/Dashboard";

const db = JsonDB.getInstance();
const categoryRepo = new CategoryRepository(db);
const walletRepo = new WalletRepository(db);
const transactionRepo = new TransactionRepository(db);
const categoryUc = new CategoryUsecase(categoryRepo);
const walletUc = new WalletUsecase(walletRepo);
const transactionUc = new TransactionUsecase(transactionRepo, walletRepo, categoryRepo);
const currencies = require("currencies.json")

ipcMain.handle("list:category", () => {
    return categoryUc.getAllCategories();
});

ipcMain.handle("list:wallet", () => {
    return walletUc.getAllWallets();
});

ipcMain.handle("list:transaction", (_event, args) => {
    if (args !== undefined) {
        let req = JSON.parse(args);
        logger.info(req)
        return transactionUc.getAllTransactions(new Date(req.startDate), new Date(req.endDate), req.walletId, req.categoryId);
    }
    return transactionUc.getAllTransactions();
});

ipcMain.handle("list:currencies", () => {
    return currencies.currencies;
})

ipcMain.handle("list:wallet-types", () => {
    return WALLET_TYPES;
})

ipcMain.handle("get:dashboard", async () => {
    try {
        let today = new Date();
        let startOfMonth = new Date(today.getFullYear(),today.getMonth(),1);
        let result: DashboardResponse = {startPeriod:startOfMonth,endPeriod:today,totalFund:0,totalIncome:0,totalSpendings:0};

        let transactions = await transactionUc.getTransactions(startOfMonth, today)
        if (transactions && !(transactions instanceof Error) && transactions.length > 0) {

            result.totalIncome = transactions.reduce((sum: number, element: Transaction) => {
                if (element.type == 1) {
                    return sum + Number(element.amount);
                }
                return sum;
            }, 0);

            result.totalSpendings = transactions.reduce((sum: number, element: Transaction) => {
                if (element.type == -1) {
                    return sum + Number(element.amount);
                }
                return sum;
            }, 0);

            result.recentTransactions = transactions.slice(0, 10);

            let spendingsArr: any[] = [];
            let incomeArr: any[] = [];
            let trx = transactions.reduce(function (res:any, value:Transaction) {
                if (value.category){
                    if (value.category.type == 1 && !res[value.category.id]) {
                        res[value.category.id] = { categoryId: value.category.id, categoryName: value.category.name, color: value.category.color, amount: 0 };
                        incomeArr.push(res[value.category.id]);
                    } else if (value.category.type == -1 && !res[value.category.id]) {
                        res[value.category.id] = { categoryId: value.category.id, categoryName: value.category.name, color: value.category.color, amount: 0 };
                        spendingsArr.push(res[value.category.id]);
                    }
                    if (res[value.category.id] !== undefined){
                        res[value.category.id].amount += Number(value.amount);
                    }
                }                
                
                return res;
            }, {});

            let spendingsChartData: ChartData = { colors: [], data: [], labels: [] };
            let incomeChartData: ChartData = { colors: [], data: [], labels: [] };

            spendingsArr.forEach(function (obj: any) {
                spendingsChartData.labels.push(obj.categoryName);
                spendingsChartData.data.push(obj.amount);
                spendingsChartData.colors.push(obj.color);
            });
            incomeArr.forEach(function (obj) {
                incomeChartData.labels.push(obj.categoryName);
                incomeChartData.data.push(obj.amount);
                incomeChartData.colors.push(obj.color);
            });

            let chartResult:Charts = {
                period:startOfMonth,
                incomeChart: incomeChartData,
                spendingChart: spendingsChartData
            }

            result.chart = chartResult;
        }


        let wallets = await walletUc.getAllWallets();
        if (wallets) {
            let totalFund = 0;
            wallets.forEach(function (obj) {
                totalFund += obj.balance;
            })
            result.totalFund = totalFund;
            result.wallets = wallets;
            result.currency = wallets[0].currency;
        }

        let firstLastTransactions = await transactionUc.getFirstAndLastTransaction();
        if (firstLastTransactions)  {
            
                result.minDate = new Date(firstLastTransactions[0].transactionDate);
                result.maxDate = new Date();
                     
        }
        
        return result;
    } catch (e:any) {
        logger.error(e)
        logger.error(e.stack)
    }
})

ipcMain.handle("get:chart", async (_event,args) => {
    try {
        let req = JSON.parse(args);
        let startDate = new Date(req.startDate);
        let endDate = new Date(req.endDate);

        let transactions = await transactionUc.getTransactions(startDate, endDate)
        if (transactions && !(transactions instanceof Error) && transactions.length > 0) {

            let spendingsArr: any[] = [];
            let incomeArr: any[] = [];
            let trx = transactions.reduce(function (res:any, value:Transaction) {
                if (value.category){
                    if (value.category.type == 1 && !res[value.category.id]) {
                        res[value.category.id] = { categoryId: value.category.id, categoryName: value.category.name, color: value.category.color, amount: 0 };
                        incomeArr.push(res[value.category.id]);
                    } else if (value.category.type == -1 && !res[value.category.id]) {
                        res[value.category.id] = { categoryId: value.category.id, categoryName: value.category.name, color: value.category.color, amount: 0 };
                        spendingsArr.push(res[value.category.id]);
                    }
                    if (res[value.category.id] !== undefined){
                        res[value.category.id].amount += Number(value.amount);
                    }
                }
                
                
                return res;
            }, {});

            let spendingsChartData: ChartData = { colors: [], data: [], labels: [] };
            let incomeChartData: ChartData = { colors: [], data: [], labels: [] };

            spendingsArr.forEach(function (obj: any) {
                spendingsChartData.labels.push(obj.categoryName);
                spendingsChartData.data.push(obj.amount);
                spendingsChartData.colors.push(obj.color);
            });
            incomeArr.forEach(function (obj) {
                incomeChartData.labels.push(obj.categoryName);
                incomeChartData.data.push(obj.amount);
                incomeChartData.colors.push(obj.color);
            });

            let chartResult:Charts = {
                period:startDate,
                incomeChart: incomeChartData,
                spendingChart: spendingsChartData
            }

            let result:Charts = chartResult;

            return result
        }
    }
    catch(e) {
        logger.error(e)
    }
})

ipcMain.handle("get:category", (_event, args) => {
    return categoryUc.getCategoryById(args); //args must be uuid string
});

ipcMain.handle("get:wallet", (_event, args) => {
    return walletUc.getWalletById(args);
});

ipcMain.handle("get:transaction", (_event, args) => {
    let data = transactionUc.getTransactionById(args);
    return data;
});

ipcMain.handle("get:currency", (_event, args) => {
    return currencies.currencies.find((obj: any) => { return obj.code == args });
})

ipcMain.handle("insert:category", (_event, args) => {
    if (args != undefined) {
        let req = JSON.parse(args) as Category;
        let cat = new Category({ name: req.name, description: req.description, icon: req.icon, color: req.color, createdAt: new Date() }, req.type);
        return categoryUc.insert(cat);
    }
    throw new Error("Empty argument");
});

ipcMain.handle("insert:wallet", (_event, args) => {
    if (!args) {
        throw new Error("Empty argument");
    }
    let req = JSON.parse(args) as Wallet;
    let model = new Wallet({ name: req.name, description: req.description, icon: req.icon, color: req.color, createdAt: new Date() }, req.currency, Number(req.balance), req.type);
    return walletUc.insert(model);
});

ipcMain.handle("insert:transaction", (_event, args) => {
    if (!args) {
        throw new Error("Empty argument");
    }
    let req = JSON.parse(args) as Transaction;
    let model = new Transaction({ description: req.description, createdAt: new Date() }, req.amount, req.type, req.walletId, req.categoryId, req.transactionDate);
    if (req.destinationWalletId) {
        model.destinationWalletId = req.destinationWalletId;
    }
    return transactionUc.insert(model);
});

ipcMain.handle("update:category", (_event, args) => {
    let req = JSON.parse(args) as Category;
    return categoryUc.update(req);
});

ipcMain.handle("update:wallet", (_event, args) => {
    let req = JSON.parse(args) as Wallet;
    return walletUc.update(req);
});

ipcMain.handle("update:transaction", (_event, args) => {
    let req = JSON.parse(args) as Transaction
    return transactionUc.update(req);
});

ipcMain.handle("delete:category", (_event, args) => {
    return categoryUc.delete(args);
});

ipcMain.handle("delete:wallet", (_event, args) => {
    return walletUc.delete(args);
});

ipcMain.handle("delete:transaction", (_event, args) => {
    return transactionUc.delete(args);
});
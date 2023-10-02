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
import { WALLET_TYPES } from "../common/constants";


const db = JsonDB.getInstance();
const categoryRepo = new CategoryRepository(db);
const walletRepo = new WalletRepository(db);
const transactionRepo = new TransactionRepository(db);
const categoryUc = new CategoryUsecase(categoryRepo);
const walletUc = new WalletUsecase(walletRepo);
const transactionUc = new TransactionUsecase(transactionRepo,walletRepo,categoryRepo);
const currencies = require("currencies.json")

ipcMain.handle("list:category", (event, args) => {
    return categoryUc.getAllCategories();
});

ipcMain.handle("list:wallet", (event,args) => {
    return walletUc.getAllWallets();
});

ipcMain.handle("list:transaction", (event,args) => {
    return transactionUc.getAllTransactions();
});

ipcMain.handle("list:currencies", (event,args) => {
    return currencies.currencies;
})

ipcMain.handle("list:wallet-types",(event,args) => {
    return WALLET_TYPES;
})

ipcMain.handle("get:category", (event, args) => {
    return categoryUc.getCategoryById(args); //args must be uuid string
});

ipcMain.handle("get:wallet",(event,args) => {
    return walletUc.getWalletById(args);
});

ipcMain.handle("get:transaction",(event,args) => {
    return transactionUc.getTransactionById(args);
});

ipcMain.handle("get:currency",(event,args) => {
    return currencies.currencies.find((obj:any) => {return obj.code == args});
})

ipcMain.handle("insert:category", (event, args) => {
    if (args != undefined) {
        let req = JSON.parse(args) as Category;
        let cat = new Category({name: req.name, description: req.description, icon: req.icon, color: req.color, createdAt: new Date()},req.type);
        return categoryUc.insert(cat);
    }
    throw new Error("Empty argument");
});

ipcMain.handle("insert:wallet",(event,args) => {
    if (!args) {
        throw new Error("Empty argument");
    }
    let req = JSON.parse(args) as Wallet;
    let model = new Wallet({name: req.name, description: req.description, icon: req.icon, color: req.color, createdAt: new Date()},req.currency, Number(req.balance),req.type);
    return walletUc.insert(model);
});

ipcMain.handle("insert:transaction",(event,args) => {
    if (!args) {
        throw new Error("Empty argument");
    }
    let req = JSON.parse(args) as Transaction;
    let model = new Transaction({description: req.description, createdAt: new Date()},req.amount,req.type,req.walletId,req.categoryId, req.transactionDate);
    return transactionUc.insert(model);
});

ipcMain.handle("update:category", (event, args) => {
    let req = JSON.parse(args) as Category;
    return categoryUc.update(req);
});

ipcMain.handle("update:wallet",(event,args) => {
    let req = JSON.parse(args) as Wallet;
    return walletUc.update(req);
});

ipcMain.handle("update:transaction",(event,args) => {
    let req = JSON.parse(args) as Transaction
    return transactionUc.update(req);
});

ipcMain.handle("delete:category", (event, args) => {
    return categoryUc.delete(args);
});

ipcMain.handle("delete:wallet",(event,args) => {
    return walletUc.delete(args);
});

ipcMain.handle("delete:transaction",(event,args) => {
    return transactionUc.delete(args);
});
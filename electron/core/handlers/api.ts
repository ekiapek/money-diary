import { ipcRenderer } from "electron";

const listCategories = () => ipcRenderer.invoke("list:category");
const listWallets = () => ipcRenderer.invoke("list:wallet");
const listTransactions = () => ipcRenderer.invoke("list:transaction");

const getCategory = (categoryId:string) => ipcRenderer.invoke("get:category",categoryId);
const getWallet = (walletId: string) => ipcRenderer.invoke("get:wallet",walletId);
const getTransaction = (transactionId: string) => ipcRenderer.invoke("get:transaction",transactionId)

const insertCategory = (data: any) => ipcRenderer.invoke("insert:category", data);
const insertWallet = (data: any) => ipcRenderer.invoke("insert:wallet", data);
const insertTransaction = (data: any) => ipcRenderer.invoke("insert:transaction", data);

const updateCategory = (data: any) => ipcRenderer.invoke("update:category",data);
const updateWallet = (data: any) => ipcRenderer.invoke("update:wallet",data);
const updateTransaction = (data: any) => ipcRenderer.invoke("update:transaction",data);

const deleteCategory = (id: string) => ipcRenderer.invoke("delete:category", id);
const deleteWallet = (id: string) => ipcRenderer.invoke("delete:wallet", id);
const deleteTransaction = (id: string) => ipcRenderer.invoke("delete:transaction", id);

export const API = {
    listCategories,
    listWallets,
    listTransactions,
    getCategory,
    getWallet,
    getTransaction,
    insertCategory,
    insertWallet,
    insertTransaction,
    updateCategory,
    updateWallet,
    updateTransaction,
    deleteCategory,
    deleteWallet,
    deleteTransaction
}
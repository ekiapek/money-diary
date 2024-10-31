import UUID from "pure-uuid";
import { Base } from "./Base";
import { Category } from "./Category";

export class Transaction {
    id: string;
    description: string;
    amount: number;
    type: number;
    walletId: string;
    destinationWalletId?: string;
    categoryId: string;
    transactionDate: Date;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
    category?: Category;

    constructor(base: Base, amount: number, type: number, walletId: string, categoryId: string,transactionDate?:Date, destinationWalletId?: string) {
        this.description = base.description;
        this.amount = amount;
        this.type = type;
        this.walletId = walletId;
        this.categoryId = categoryId;
        this.id = base.id?base.id:new UUID(4).toString();
        this.createdAt = base.createdAt;
        this.updatedAt = base.updatedAt;
        this.destinationWalletId = destinationWalletId;
        this.transactionDate = transactionDate ? transactionDate : this.createdAt;
        this.isDeleted = base.isDeleted; 
    }
}
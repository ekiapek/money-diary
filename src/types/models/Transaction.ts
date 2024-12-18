import { Base } from "./Base";

export class Transaction {
    id: string;
    description: string;
    amount?: number;
    type?: number;
    walletId?: string;
    destinationWalletId?: string;
    categoryId?: string;
    transactionDate: Date;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted?: boolean;

    constructor(base: Base, amount?: number, type?: number, walletId?: string, categoryId?: string,transactionDate?:Date, destinationWalletId?: string) {
        this.description = base.description;
        this.amount = amount;
        this.type = type;
        this.walletId = walletId;
        this.categoryId = categoryId;
        this.id = "";
        this.createdAt = base.createdAt;
        this.updatedAt = base.updatedAt;
        this.destinationWalletId = destinationWalletId;
        this.transactionDate = transactionDate ? transactionDate : this.createdAt;
        this.isDeleted = base.isDeleted; 
    }
}
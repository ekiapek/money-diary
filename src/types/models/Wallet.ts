import { Base } from "./Base";

export class Wallet{
    id: string;
    name: string|undefined;
    description: string|undefined;
    currency: string;
    balance: number;
    type: string;
    icon: string|undefined;
    color: string|undefined;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
    
    constructor(base: Base, currency:string, balance: number,type:string) {
        this.name = base.name;
        this.description = base.description;
        this.icon = base.icon;
        this.color = base.color;
        this.balance = balance;
        this.currency = currency;
        this.type = type;
        this.id = "";
        this.createdAt = base.createdAt;
        this.updatedAt = base.updatedAt;
        this.isDeleted = base.isDeleted;        
    }
}

export const WALLET_TYPE_REGULAR = "regular";
export const WALLET_TYPE_SAVINGS = "saving";
export const WALLET_TYPE_INVESTMENT = "investment";
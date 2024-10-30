import { Base } from "./Base";
import UUID from "pure-uuid";

export class Budget {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    balance: number;
    amount: number;
    accumulate: boolean;
    resetConfig: BudgetReset|undefined;
    currency: string;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted?: boolean;

    constructor(base: Base, amount: number, balance: number, currency:string, accumulate:boolean, resetConfig?:BudgetReset) {
        this.name = base.name ? base.name: "";
        this.description = base.description;
        this.icon = base.icon ? base.icon: "";
        this.color = base.color ? base.color: "#f5f5f5";
        this.amount = amount;
        this.balance = balance;
        this.accumulate = accumulate;
        this.resetConfig = resetConfig;
        this.currency = currency;
        this.id = base.id?base.id:new UUID(4).toString();
        this.createdAt = base.createdAt;
        this.updatedAt = base.updatedAt;
        this.isDeleted = base.isDeleted;
    }
}

export type BudgetReset = {
    frequencyType: string;
    frequencyMultiplier: number;
    resetAt: number;
    resetAtUnit: string;
}

export class BudgetAccumulateHistory {
    budgetId: string;
    amount: number;
    createdAt: Date;

    constructor(budgetId: string, amount: number, createdAt: Date) {
        this.budgetId = budgetId;
        this.amount = amount;
        this.createdAt = createdAt;
    }
}
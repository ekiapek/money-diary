import UUID, {UUIDConstructor} from "pure-uuid"
import { Base } from "./Base";

export class Transaction {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    amount: number;
    type: number;
    walletId: string;
    categoryId: string;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted?: boolean;

    constructor(base: Base, amount: number, type: number, walletId: string, categoryId: string) {
        this.name = base.name;
        this.description = base.description;
        this.icon = base.icon;
        this.color = base.color;
        this.amount = amount;
        this.type = type;
        this.walletId = walletId;
        this.categoryId = categoryId;
        this.id = base.id?base.id:new UUID(4).toString();
        this.createdAt = base.createdAt;
        this.updatedAt = base.updatedAt;
        this.isDeleted = base.isDeleted; 
    }
}
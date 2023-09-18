import UUID, {UUIDConstructor} from "pure-uuid"
import { Base } from "./Base";

export class Wallet{
    id: string;
    name: string;
    description: string;
    currency: string;
    balance: number;
    type: string;
    icon: string;
    color: string;
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
        this.id = base.id?base.id:new UUID(4).toString();
        this.createdAt = base.createdAt;
        this.updatedAt = base.updatedAt;
        this.isDeleted = base.isDeleted;        
    }
}
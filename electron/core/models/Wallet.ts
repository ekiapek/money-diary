import UUID, {UUIDConstructor} from "pure-uuid"
import { Base } from "./Base";

export class Wallet{
    id: string;
    name: string;
    description: string;
    balance: number;
    icon: string;
    color: string;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
    
    constructor(base: Base,balance: number) {
        this.name = base.name;
        this.description = base.description;
        this.icon = base.icon;
        this.color = base.color;
        this.balance = balance;
        this.id = base.id?base.id:new UUID(4).toString();
        this.createdAt = base.createdAt;
        this.updatedAt = base.updatedAt;
        this.isDeleted = base.isDeleted;        
    }
}
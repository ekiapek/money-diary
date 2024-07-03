import UUID from "pure-uuid"
import { Base } from "./Base";

export class Category{
    public id: string;
    public name: string|undefined;
    public description: string|undefined;
    public icon: string|undefined;
    public color: string|undefined;
    public type: number;
    public createdAt: Date;
    public updatedAt?: Date;
    public isDeleted?: boolean;

    /**
     *
     */
    constructor(base:Base,type:number) {
        this.name = base.name;
        this.description = base.description;
        this.icon = base.icon;
        this.color = base.color;
        this.type = type;
        this.id = base.id?base.id:new UUID(4).toString();
        this.createdAt = base.createdAt;
        this.updatedAt = base.updatedAt;
        this.isDeleted = base.isDeleted;
    }
}
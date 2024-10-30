import UUID from "pure-uuid"
import { Base } from "./Base";

export class Category{
    public id: string;
    public name: string;
    public description: string;
    public icon: string;
    public color: string;
    public type: number;
    public createdAt: Date;
    public updatedAt?: Date;
    public isDeleted?: boolean;

    /**
     *
     */
    constructor(base:Base,type:number) {
        this.name = base.name ? base.name: "";
        this.description = base.description;
        this.icon = base.icon ? base.icon: "";
        this.color = base.color ? base.color: "#f5f5f5";
        this.type = type;
        this.id = base.id?base.id:new UUID(4).toString();
        this.createdAt = base.createdAt;
        this.updatedAt = base.updatedAt;
        this.isDeleted = base.isDeleted;
    }
}
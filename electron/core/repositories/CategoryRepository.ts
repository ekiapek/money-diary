import type { Knex } from "knex";
import { Category } from "../models/category";
import { ICategoryRepository } from "./interfaces/ICategoryRepository";

export class CategoryRepository implements ICategoryRepository {
    private db: Knex;
    /**
     *
     */
    constructor(db: Knex) {
        this.db = db;
    }
    async getAll(): Promise<Category[]> {
        return this.db<Category>("categories");
    }
    async getById(id: string): Promise<Category | undefined> {
        return this.db<Category>("categories").where('id', id).first();
    }
    async update(data: Category): Promise<boolean> {
        this.db("categories")
            .where('id', data.id)
            .update({
                name: data.name,
                description: data.description,
                icon: data.icon,
                color: data.color,
                updatedAt: Date.now()
            }).then(rows => {
                if (!rows) return false;
                return true
            }).catch(err => { return false });
        return false;
    }
    async insert(data: Category): Promise<boolean> {
        this.db("categories").insert(
            {
                id: data.id,
                name: data.name,
                description: data.description,
                icon: data.icon,
                color: data.color,
                createdAt: Date.now()
            }
        ).then(rows => {
            if (!rows) return false;
            return true
        }).catch(err => { return false });
        return false;
    }

}

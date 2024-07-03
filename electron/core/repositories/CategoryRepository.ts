// import type { Knex } from "knex";
import { JsonDB } from "../util/db/json";
import { Category } from "../models/Category";
import { ICategoryRepository } from "./interfaces/ICategoryRepository";
import { logger } from "../util/logging/winston";


export class CategoryRepository implements ICategoryRepository {
    private db: JsonDB;

    private key = "category";
    /**
     *
     */
    constructor(db: JsonDB) {
        this.db = db;
    }

    getAll(): Promise<Category[]> {
        return new Promise((resolve, reject) => {
            try {
                let data = this.db.getData<Category>(this.key)
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });

    }

    getById(id: string): Promise<Category | undefined> {
        return new Promise((resolve, reject) => {
            try {
                let data = this.db.getData<Category>(this.key).find(x => x.id === id);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }

    update(data: Category): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                this.db.updateData(this.key, data);
                resolve(true);
            } catch (error) {
                logger.error(error);
                reject(false);
            }
        });
    }

    insert(data: Category): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                this.db.pushData<Category>(this.key, data);
                resolve(true);
            } catch (error) {
                logger.error(error);
                reject(false);
            }
        });
    }

    delete(id: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                this.db.removeById(this.key, id);
                resolve(true);
            } catch (error) {
                logger.error(error);
                reject(false);
            }
        });
    }
}

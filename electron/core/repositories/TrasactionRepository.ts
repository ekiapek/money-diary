
import { Transaction } from "../models/Transaction";
import { JsonDB } from "../util/db/json";
import { logger } from "../util/logging/winston";
import { ITrasactionRepository } from "./interfaces/ITransactionRepository";

export class TransactionRepository implements ITrasactionRepository{
    private db: JsonDB;
    private key = "transaction"
    /**
     *
     */
    constructor(db: JsonDB) {
        this.db = db
    }
    getAll(): Promise<Transaction[]> {
        return new Promise((resolve, reject) => {
            try {
                let data = this.db.getData<Transaction>(this.key)
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
    getById(id: string): Promise<Transaction|undefined> {
        return new Promise((resolve, reject) => {
            try {
                let data = this.db.getData<Transaction>(this.key).find(x => x.id === id);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
    insert(data: Transaction): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                this.db.pushData<Transaction>(this.key, data);
                resolve(true);
            } catch (error) {
                logger.error(error);
                reject(false);
            }
        });
    }
    update(data: Transaction): Promise<boolean> {
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
import { Knex } from "knex";
import { Transaction } from "../models/transaction";
import { ITrasactionRepository } from "./interfaces/ITransactionRepository";

export class TransactionRepository implements ITrasactionRepository{
    private db: Knex;
    /**
     *
     */
    constructor(db: Knex) {
        this.db = db
    }
    async getAll(): Promise<Transaction[]> {
        throw new Error("Method not implemented.");
    }
    async getById(id: string): Promise<Transaction|undefined> {
        throw new Error("Method not implemented.");
    }
    async insert(data: Transaction): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async update(data: Transaction): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    
}
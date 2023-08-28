import { Knex } from "knex";
import { Wallet } from "../models/wallet";
import { IWalletRepository } from "./interfaces/IWalletRepository";

export class WalletRepository implements IWalletRepository{
    private db: Knex;
    /**
     *
     */
    constructor(db: Knex) {
        this.db = db;
    }
    async getAll(): Promise<Wallet[]> {
        throw new Error("Method not implemented.");
    }
    async getById(id: string): Promise<Wallet|undefined> {
        throw new Error("Method not implemented.");
    }
    async insert(data: Wallet): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async update(data: Wallet): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    
}
import { Wallet } from "../models/Wallet";
import { JsonDB } from "../util/db/json";
import { logger } from "../util/logging/winston";
import { IWalletRepository } from "./interfaces/IWalletRepository";

export class WalletRepository implements IWalletRepository {
    private db: JsonDB;
    private key = "wallet";
    /**
     *
     */
    constructor(db: JsonDB) {
        this.db = db;
    }
    getAll(): Promise<Wallet[]> {
        return new Promise((resolve, reject) => {
            try {
                let data = this.db.getData<Wallet>(this.key)
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
    getById(id: string): Promise<Wallet | undefined> {
        return new Promise((resolve, reject) => {
            try {
                let data = this.db.getData<Wallet>(this.key).find(x => x.id === id);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
    insert(data: Wallet): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                this.db.pushData<Wallet>(this.key, data);
                this.db.persistData(this.key);
                resolve(true);
            } catch (error) {
                logger.error(error);
                reject(false);
            }
        });
    }
    update(data: Wallet): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                this.db.updateData(this.key, data);
                this.db.persistData(this.key);
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
                this.db.persistData(this.key);
                resolve(true);
            } catch (error) {
                logger.error(error);
                reject(false);
            }
        });
    }
}
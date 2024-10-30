import { Budget, BudgetAccumulateHistory } from "../models/Budget";
import { JsonDB } from "../util/db/json";
import { logger } from "../util/logging/winston";
import { IBudgetRepository } from "./interfaces/IBudgetRepository";

export class BudgetRepository implements IBudgetRepository {
    private db: JsonDB;
    private key = "budget";
    private budgetAccumulationHistoryKey = "budgetAccumulationHistory";
    /**
     *
     */
    constructor(db: JsonDB) {
        this.db = db;
    }
    getAll(): Promise<Budget[]> {
        return new Promise((resolve, reject) => {
            try {
                let data = this.db.getData<Budget>(this.key)
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
    getById(id: string): Promise<Budget | undefined> {
        return new Promise((resolve, reject) => {
            try {
                let data = this.db.getData<Budget>(this.key).find(x => x.id === id);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
    getAccumulateHistoryByBudgetId(budgetId: string): Promise<Array<BudgetAccumulateHistory>> {
        return new Promise((resolve, reject) => {
            try {
                let data = this.db.getData<BudgetAccumulateHistory>(this.budgetAccumulationHistoryKey).filter(x => x.budgetId === budgetId);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    } 
    insert(data: Budget): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                this.db.pushData<Budget>(this.key, data);
                resolve(true);
            } catch (error) {
                logger.error(error);
                reject(false);
            }
        });
    }
    update(data: Budget): Promise<boolean> {
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
import { Transaction } from "../../models/Transaction";

export interface ITrasactionRepository {
    getAll(): Promise<Transaction[]>;
    getById(id: string): Promise<Transaction|undefined>;
    insert(data: Transaction): Promise<boolean>;
    update(data: Transaction): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}
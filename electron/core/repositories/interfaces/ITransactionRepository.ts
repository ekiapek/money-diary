import { Transaction } from "../../models/transaction";


export interface ITrasactionRepository {
    getAll(): Promise<Transaction[]>;
    getById(id: string): Promise<Transaction|undefined>;
    insert(data: Transaction): Promise<boolean>;
    update(data: Transaction): Promise<boolean>;
}
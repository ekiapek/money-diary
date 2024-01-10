import { Transaction } from "../../models/Transaction";

export interface ITransactionUsecase{
    getAllTransactions(from?: Date, to?: Date):Promise<Transaction[]|Error>;
    getTransactions(from?: Date, to?: Date):Promise<Transaction[]|Error>;
    getTransactionById(id: string): Promise<Transaction|undefined>;
    update(data: Transaction): Promise<boolean>;
    insert(data: Transaction): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    getFirstAndLastTransaction(): Promise<Transaction[]>;
}
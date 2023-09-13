import { Transaction } from "../models/Transaction";
import { ITrasactionRepository } from "../repositories/interfaces/ITransactionRepository";
import { ITransactionUsecase } from "./interfaces/ITransactionUsecase";

export class TransactionUsecase implements ITransactionUsecase{
    private repo: ITrasactionRepository;

    /**
     *
     */
    constructor(walletRepo: ITrasactionRepository) {
        this.repo = walletRepo;
        
    }
    async getAllTransactions(): Promise<Transaction[]> {
        return await this.repo.getAll();
    }
    async getTransactionById(id: string): Promise<Transaction | undefined> {
        return await this.repo.getById(id);
    }
    async update(data: Transaction): Promise<boolean> {
        return await this.repo.update(data);
    }
    async insert(data: Transaction): Promise<boolean> {
        return await this.repo.insert(data);
    }
    async delete(id: string): Promise<boolean> {
        return await this.repo.delete(id);
    }
    
}
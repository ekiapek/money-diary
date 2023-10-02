import { Wallet } from "../models/Wallet";
import { IWalletRepository } from "../repositories/interfaces/IWalletRepository";
import { IWalletUsecase } from "./interfaces/IWalletUsecase";

export class WalletUsecase implements IWalletUsecase {
    private repo: IWalletRepository;

    /**
     *
     */
    constructor(walletRepo: IWalletRepository) {
        this.repo = walletRepo;
        
    }
    async getAllWallets(): Promise<Wallet[]> {
        return await this.repo.getAll();
    }
    async getWalletById(id: string): Promise<Wallet | undefined> {
        return await this.repo.getById(id);
    }
    async update(data: Wallet): Promise<boolean> {
        data.updatedAt = new Date();
        return await this.repo.update(data);
    }
    async insert(data: Wallet): Promise<boolean> {
        return await this.repo.insert(data);
    }
    async delete(id: string): Promise<boolean> {
        return await this.repo.delete(id);
    }
    
}
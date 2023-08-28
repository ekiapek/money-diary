import { Wallet } from "../../models/wallet";

export interface IWalletRepository {
    getAll(): Promise<Wallet[]>;
    getById(id: string): Promise<Wallet|undefined>;
    insert(data: Wallet): Promise<boolean>;
    update(data: Wallet): Promise<boolean>;
}
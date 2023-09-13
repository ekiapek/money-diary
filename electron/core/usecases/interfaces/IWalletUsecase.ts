import { Wallet } from "../../models/Wallet";

export interface IWalletUsecase{
    getAllWallets(): Promise<Wallet[]>;
    getWalletById(id: string): Promise<Wallet|undefined>;
    update(data: Wallet): Promise<boolean>;
    insert(data: Wallet): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}
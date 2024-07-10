import { Category } from "../models/Category";
import { Transaction } from "../models/Transaction";
import { Wallet } from "../models/Wallet";
import { ICategoryRepository } from "../repositories/interfaces/ICategoryRepository";
import { ITrasactionRepository } from "../repositories/interfaces/ITransactionRepository";
import { IWalletRepository } from "../repositories/interfaces/IWalletRepository";
import { JsonDB } from "../util/db/json";
import { logger } from "../util/logging/winston";
import { ITransactionUsecase } from "./interfaces/ITransactionUsecase";

const Transfer_Category = new Category({ name: "Transfer Money", color: "#275DAD", icon: "🔄", description: "", createdAt: new Date() }, 2)
export class TransactionUsecase implements ITransactionUsecase {
    private repo: ITrasactionRepository;
    private walletRepo: IWalletRepository;
    private categoryRepo: ICategoryRepository;

    /**
     *
     */
    constructor(repo: ITrasactionRepository, walletRepo: IWalletRepository, categoryRepo: ICategoryRepository) {
        this.repo = repo;
        this.walletRepo = walletRepo;
        this.categoryRepo = categoryRepo;
    }

    /**
     * Retrieve all transactions in date range and group them by date.
    */
    async getAllTransactions(from?: Date, to?: Date): Promise<Transaction[] | Error> {
        try {
            let result: any = {};
            let trxResponse = await this.getTransactions(from, to);

            let transactions = JsonDB.groupBy(trxResponse, (x: Transaction) => x.transactionDate.toLocaleDateString());

            let resultData: any[] = []
            let dateKeys = Object.keys(transactions);

            dateKeys.forEach((key: string) => {
                let resData: any = {};
                transactions[key] = transactions[key].sort((x: Transaction, y: Transaction) => (x.transactionDate > y.transactionDate ? -1 : 1));
                resData["date"] = new Date(key);
                resData["transactions"] = transactions[key];
                resultData.push(resData);
            });

            resultData = resultData.sort((x, y) => x.date > y.date ? -1 : 1);
            result["data"] = resultData;
            return result;
        }
        catch (e:any) {
            logger.error(e.stack)
            return Error("Failed to load transactions");
        }

    }

    /**
     * Retrieve all transactions in date range.
    */
    async getTransactions(from?: Date, to?: Date): Promise<Transaction[] | Error> {
        try {
            let transactions = await this.repo.getAll();
            let categories = await this.categoryRepo.getAll();
            let wallets = await this.walletRepo.getAll();

            if (!transactions) {
                return [];
            }


            let trxResponse: any[] = [];
            transactions.forEach(function (obj) {
                let trx: any = { ...obj };
                let category = categories.find((x: Category) => { return x.id == obj.categoryId });
                let wallet = wallets.find((x: Wallet) => { return x.id == obj.walletId })
                trx["wallet"] = wallet;
                trx["category"] = category;

                if (obj.type == 2) {
                    trx["category"] = Transfer_Category;
                }

                if (typeof trx.createdAt === "string") {
                    trx.createdAt = new Date(trx.createdAt);
                }

                if (trx.transactionDate === undefined) {
                    trx.transactionDate = trx.createdAt;
                }
                else if (trx.transactionDate !== undefined && typeof trx.transactionDate === "string") {
                    trx.transactionDate = new Date(trx.transactionDate);
                }

                trxResponse.push(trx);
            });

            if (from !== undefined) {
                trxResponse = trxResponse.filter((obj: Transaction) => {
                    return obj.transactionDate.getTime() > from.getTime();
                })
            }

            if (to !== undefined) {
                trxResponse = trxResponse.filter((obj: Transaction) => {
                    return obj.transactionDate.getTime() < to.getTime();
                })
            }

            trxResponse = trxResponse.sort((x: Transaction, y: Transaction) => (x.transactionDate > y.transactionDate ? -1 : 1));

            return trxResponse;
        }
        catch (e:any) {
            logger.error(e.stack);
            return Error("Failed to load transactions");
        }
    }
    async getTransactionById(id: string): Promise<Transaction | undefined> {
        return await this.repo.getById(id);
    }

    async update(data: Transaction): Promise<boolean> {
        try {
            await this.delete(data.id);
            await this.insert(data);

            return true;
        }
        catch (e) {
            logger.error(e);
            return false
        }
    }

    async insert(data: Transaction): Promise<boolean> {
        try {
            if (data.type == 2 && data.destinationWalletId) {
                let srcWallet = await this.walletRepo.getById(data.walletId);
                let destWallet = await this.walletRepo.getById(data.destinationWalletId);

                if (srcWallet === undefined || destWallet === undefined) {
                    return false
                }

                srcWallet.balance = Number(srcWallet.balance) - Number(data.amount);
                destWallet.balance = Number(destWallet.balance) + Number(data.amount);
                data.categoryId = "TRANSFER";
                if (!data.description) {
                    data.description = "Transfer from " + srcWallet.name + " to " + destWallet.name;
                }
                if (await this.walletRepo.update(srcWallet) && await this.walletRepo.update(destWallet)) {
                    return await this.repo.insert(data);
                }
            }
            else {
                let wallet = await this.walletRepo.getById(data.walletId);

                if (wallet === undefined) {
                    return false
                }
                wallet.balance += data.amount * data.type;
                if (await this.walletRepo.update(wallet)) {
                    return await this.repo.insert(data);
                }
            }
        }
        catch (e) {
            logger.error(e)
        }
        return false;
    }
    async delete(id: string): Promise<boolean> {
        try {
            let data = await this.repo.getById(id);
            if (data === undefined) {
                return false
            }
            if (data.type == 2 && data.destinationWalletId) {
                let srcWallet = await this.walletRepo.getById(data.walletId);
                let destWallet = await this.walletRepo.getById(data.destinationWalletId);
                if (srcWallet && destWallet) {
                    srcWallet.balance = Number(srcWallet.balance) + Number(data.amount);
                    destWallet.balance = Number(destWallet.balance) - Number(data.amount);
                    if (await this.walletRepo.update(srcWallet) && await this.walletRepo.update(destWallet)) {
                        return await this.repo.delete(data?.id);
                    }
                }
            }
            let wallet = await this.walletRepo.getById(data.walletId);
            if (wallet !== undefined) {
                wallet.balance += data.amount * data.type * -1;
                if (await this.walletRepo.update(wallet)) {
                    return await this.repo.delete(data?.id);
                }
            }
        }
        catch (e) {
            logger.error(e);
            return false;
        }
        return false;
    }
    async getFirstAndLastTransaction(): Promise<Transaction[]> {
        let result:Transaction[] = [];
        try {
            let transactions = await this.repo.getAll();
            if (!transactions) {
                return result;
            }
            transactions = transactions.sort((x:Transaction,y:Transaction) => (new Date(x.transactionDate) < new Date(y.transactionDate) ? -1 : 1));
            result.push(transactions[0]);
            result.push(transactions[transactions.length - 1]);
        } catch (e) {
            logger.error(e);            
        }
        return result;
    }
}
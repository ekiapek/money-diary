import { Category } from "../models/Category";
import { Transaction } from "../models/Transaction";
import { Wallet } from "../models/Wallet";
import { ICategoryRepository } from "../repositories/interfaces/ICategoryRepository";
import { ITrasactionRepository } from "../repositories/interfaces/ITransactionRepository";
import { IWalletRepository } from "../repositories/interfaces/IWalletRepository";
import { JsonDB } from "../util/db/json";
import { logger } from "../util/logging/winston";
import { ITransactionUsecase } from "./interfaces/ITransactionUsecase";
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

    async getAllTransactions(from?: Date, to?: Date):Promise<Transaction[]|Error> {
        try {
            let transactions = await this.repo.getAll();
            let categories = await this.categoryRepo.getAll();
            let wallets = await this.walletRepo.getAll();
            let result:any = {}

            if (!transactions) {
                throw "failed to get transactions";
            }
            
            // transactions = transactions.sort((x: Transaction, y: Transaction) => (x.createdAt > y.createdAt ? -1 : 1));

            let trxResponse: any[] = [];
            transactions.forEach(function (obj) {
                let trx: any = { ...obj };
                let category = categories.find((x: Category) => { return x.id == obj.categoryId });
                let wallet = wallets.find((x: Wallet) => { return x.id == obj.walletId })
                trx["wallet"] = wallet;
                trx["category"] = category;

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

            transactions = JsonDB.groupBy(trxResponse, (x: Transaction) => x.transactionDate.toLocaleDateString());

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
        catch (e) {
            logger.error(e.stack)
            return Error("Failed to load transactions");
        }

    }
    async getTransactions(from?: Date, to?: Date):Promise<Transaction[]|Error> {
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
        catch (e) {
            logger.error(e.stack);
            return Error("Failed to load transactions");
        }
    }
    async getTransactionById(id: string): Promise<Transaction | undefined> {
        return await this.repo.getById(id);
    }
    async update(data: Transaction): Promise<boolean> {
        return new Promise(async (resolve,reject) => {
            try{
                await this.delete(data.id);
                await this.insert(data);
                resolve(true);
            }
            catch(e){
                logger.error(e);
                reject(false)
            }
        });
    }
    async insert(data: Transaction): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                let wallet = await this.walletRepo.getById(data.walletId);

                if (wallet !== undefined) {
                    wallet.balance += data.amount * data.type;
                    this.walletRepo.update(wallet).then((result) => {
                        if (result) {
                            resolve(this.repo.insert(data));
                        }
                    })
                }
            }
            catch (e) {
                logger.error(e)
                reject(false);
            }
        });

    }
    async delete(id: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try{
            let data = await this.repo.getById(id);
            if (data !== undefined) {
                let wallet = await this.walletRepo.getById(data.walletId);
                if (wallet !== undefined) {
                    wallet.balance += data.amount * data.type * -1;
                    this.walletRepo.update(wallet).then((result) => {
                        if (result) {
                            this.repo.delete(data?.id).then((result) => {
                                if (result) {
                                    resolve(true);
                                }
                            }).catch(()=>{reject(false)})
                        }
                    })
                }
            }
            }
            catch(e){
                logger.error(e);
                reject(false);
            }
        });
    }

}
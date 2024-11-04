import { Category } from "../models/Category";
import { Transaction, TransactionResponse } from "../models/Transaction";
import { ICategoryRepository } from "../repositories/interfaces/ICategoryRepository";
import { ITrasactionRepository } from "../repositories/interfaces/ITransactionRepository";
import { IWalletRepository } from "../repositories/interfaces/IWalletRepository";
import { JsonDB } from "../util/db/json";
import { logger } from "../util/logging/winston";
import { ITransactionUsecase } from "./interfaces/ITransactionUsecase";

const Transfer_Category = new Category({ name: "Transfer Money", color: "#275DAD", icon: "🔄", description: "", createdAt: new Date() }, 2);
const Uncategorized = new Category({ name: "Uncategorized", color: "#b5b5b5", icon: "", description: "", createdAt: new Date() }, 0); 
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
    async getAllTransactions(from?: Date, to?: Date, walletId?: string, categoryId?: string): Promise<Transaction[] | Error> {
        try {
            let result: any = {};
            let trxResponse = await this.getTransactions(from, to, walletId, categoryId);
            if (!trxResponse || (!(trxResponse instanceof Error) && trxResponse.length < 1)) {
                let res: Transaction[] = [];
                return res;
            }

            console.log(JSON.stringify(trxResponse));

            let transactions = JsonDB.groupBy(trxResponse, (x: Transaction) => x.transactionDate.toLocaleDateString());

            let resultData: any[] = [];
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

            let firstLastTransactions = await this.getFirstAndLastTransaction();
            if (firstLastTransactions) {
                result["minDate"] = new Date(firstLastTransactions[0].transactionDate);
                result["maxDate"] = new Date();
            }

            result["activePeriod"] = from;

            return result;
        }
        catch (e: any) {
            logger.error(e.stack);
            return Error("Failed to load transactions");
        }

    }

    /**
     * Retrieve all transactions in date range.
    */
    async getTransactions(
        from?: Date,
        to?: Date,
        walletId?: string,
        categoryId?: string
    ): Promise<Transaction[] | Error> {
        try {
            // Fetch all data concurrently
            const [transactions, categories, wallets] = await Promise.all([
                this.repo.getAll(),
                this.categoryRepo.getAll(),
                this.walletRepo.getAll()
            ]);

            if (!transactions) return [];

            // Enhance transactions with wallet and category data
            const trxResponse = transactions.map((obj) => {
                const trx:TransactionResponse = { ...obj };
                let category = categories?.find((x) => x.id === obj.categoryId);
                if (!category) {
                    category = Uncategorized;
                }
                
                const wallet = wallets.find((x) => x.id === obj.walletId);
                if (!wallet) {
                    return null;
                }

                trx.wallet = wallet;
                trx.category = obj.type === 2 ? Transfer_Category : category;
                trx.createdAt = new Date(trx.createdAt);
                trx.transactionDate = trx.transactionDate
                    ? new Date(trx.transactionDate)
                    : trx.createdAt;

                return trx;
            }).filter(
                (val) => !!val
            );

            // Apply filters
            let filteredTransactions = trxResponse;

            if (from) {
                filteredTransactions = filteredTransactions.filter(
                    (obj) => obj.transactionDate.getTime() >= from.getTime()
                );
            }

            if (to) {
                const endOfDay = new Date(to);
                endOfDay.setHours(23, 59, 59, 999);
                filteredTransactions = filteredTransactions.filter(
                    (obj) => obj.transactionDate.getTime() <= endOfDay.getTime()
                );
            }

            if (walletId) {
                filteredTransactions = filteredTransactions.filter(
                    (obj) => obj.walletId === walletId
                );
            }

            if (categoryId) {
                filteredTransactions = filteredTransactions.filter(
                    (obj) => obj.categoryId === categoryId
                );
            }

            // Sort transactions by date in descending order
            filteredTransactions.sort((x, y) =>
                x.transactionDate > y.transactionDate ? -1 : 1
            );

            return filteredTransactions;
        } catch (e: any) {
            logger.error(e.stack);
            return new Error("Failed to load transactions");
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
            return false;
        }
    }

    async insert(data: Transaction): Promise<boolean> {
        try {
            let wallet = await this.walletRepo.getById(data.walletId);

            if (wallet === undefined) {
                return false;
            }

            if (data.type == 2 && data.destinationWalletId) {
                let srcWallet = wallet;
                let destWallet = await this.walletRepo.getById(data.destinationWalletId);

                if (srcWallet === undefined || destWallet === undefined) {
                    return false;
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
                wallet.balance += data.amount * data.type;
                if (await this.walletRepo.update(wallet)) {
                    return await this.repo.insert(data);
                }
            }
        }
        catch (e) {
            logger.error(e);
        }
        return false;
    }
    async delete(id: string): Promise<boolean> {
        try {
            let data = await this.repo.getById(id);
            if (data === undefined) {
                return false;
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
        let result: Transaction[] = [];
        try {
            let transactions = await this.repo.getAll();
            if (!transactions || transactions.length < 1) {
                return result;
            }
            transactions = transactions.sort((x: Transaction, y: Transaction) => (new Date(x.transactionDate) < new Date(y.transactionDate) ? -1 : 1));
            if (transactions.length > 2) {
                result.push(transactions[0]);
                result.push(transactions[transactions.length - 1]);
            } else {
                result.push(transactions[0]);
                result.push(transactions[0]);
            }
        } catch (e) {
            logger.error(e);
        }
        return result;
    }
}
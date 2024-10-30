import { Budget } from "../../models/Budget";

export interface IBudgetRepository {
    getAll(): Promise<Budget[]>;
    getById(id: string): Promise<Budget|undefined>;
    insert(data: Budget): Promise<boolean>;
    update(data: Budget): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}
import { Category } from "../../models/Category";

export interface ICategoryRepository {
    getAll(): Promise<Category[]>;
    getById(id: string): Promise<Category|undefined>;
    update(data: Category): Promise<boolean>;
    insert(data: Category): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}

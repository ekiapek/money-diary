import { Category } from "../../models/category";

export interface ICategoryRepository {
    getAll(): Promise<Category[]>;
    getById(id: string): Promise<Category|undefined>;
    update(data: Category): Promise<boolean>;
    insert(data: Category): Promise<boolean>;
}

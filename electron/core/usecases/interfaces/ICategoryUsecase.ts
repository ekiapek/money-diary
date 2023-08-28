import { Category } from "../../models/category";

export interface ICategoryUsecase{
    getAllCategories(): Promise<Category[]>;
    getCategoryById(id: string): Promise<Category|undefined>;
    update(data: Category): Promise<boolean>;
    insert(data: Category): Promise<boolean>;
}
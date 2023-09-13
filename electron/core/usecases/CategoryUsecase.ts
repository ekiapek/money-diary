import { Category } from "../models/Category";
import { ICategoryRepository } from "../repositories/interfaces/ICategoryRepository";
import { ICategoryUsecase } from "./interfaces/ICategoryUsecase";

export class CategoryUsecase implements ICategoryUsecase {
    private categoryRepository: ICategoryRepository;

    /**
     *
     */
    constructor(categoryRepo: ICategoryRepository) {
        this.categoryRepository = categoryRepo;
    }
    
    async getAllCategories(): Promise<Category[]> {
        return await this.categoryRepository.getAll();
    }
    async getCategoryById(id: string): Promise<Category | undefined> {
        return await this.categoryRepository.getById(id);
    }
    async update(data: Category): Promise<boolean> {
        return await this.categoryRepository.update(data);
    }
    async insert(data: Category): Promise<boolean> {
        return await this.categoryRepository.insert(data);
    }
    async delete(id: string): Promise<boolean>{
        return await this.categoryRepository.delete(id);
    }
}
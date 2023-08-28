import { Category } from "../models/category";
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
    
    getAllCategories(): Promise<Category[]> {
        return this.categoryRepository.getAll();
    }
    getCategoryById(id: string): Promise<Category | undefined> {
        return this.categoryRepository.getById(id);
    }
    update(data: Category): Promise<boolean> {
        return this.categoryRepository.update(data);
    }
    insert(data: Category): Promise<boolean> {
        return this.categoryRepository.insert(data);
    }
}
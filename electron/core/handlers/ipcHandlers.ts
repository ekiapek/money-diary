import { ipcMain } from "electron";
import { JsonDB } from "../util/db/json";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { CategoryUsecase } from "../usecases/CategoryUsecase";
import { Category } from "../models/Category";


const db = JsonDB.getInstance();
const categoryRepo = new CategoryRepository(db);
const categoryUc = new CategoryUsecase(categoryRepo);

ipcMain.handle("list:category", (event, args) => {
    return categoryUc.getAllCategories();
});

ipcMain.handle("get:category", (event, args) => {
    return categoryUc.getCategoryById(args); //args must be uuid string
});

ipcMain.handle("insert:category", (event, args) => {
    console.log(args);
    if (args != undefined) {
        let req = JSON.parse(args) as Category
        console.log(req)
        let cat = new Category({name: req.name, description: req.description, icon: req.icon, color: req.color, createdAt: new Date(), },req.type)
        return categoryUc.insert(cat);
    }
    throw new Error("Empty argument")
});

ipcMain.handle("update:category", (event, args) => {
    let req = JSON.parse(args) as Category
    return categoryUc.update(req);
});

ipcMain.handle("delete:category", (event, args) => {
    return categoryUc.delete(args);
});
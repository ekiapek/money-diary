import { ipcRenderer } from "electron";
import { Category } from "../models/Category";

const listCategories = () => ipcRenderer.invoke("list:category");
const getCategory = (categoryId:string) => ipcRenderer.invoke("get:category",categoryId);
const insertCategory = (data: any) => ipcRenderer.invoke("insert:category", data);
const updateCategory = (data: any) => ipcRenderer.invoke("update:category",data);
const deleteCategory = (id: string) => ipcRenderer.invoke("delete:category", id);

export const API = {
    listCategories,
    getCategory,
    insertCategory,
    updateCategory,
    deleteCategory
}
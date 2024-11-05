import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import MainRoutes from "./MainRoutes";

export const router = createRouter({
    history: import.meta.env.PROD ? createWebHashHistory(import.meta.env.BASE_URL) : createWebHistory(import.meta.env.BASE_URL),
    routes: [
        MainRoutes,
    ]
});


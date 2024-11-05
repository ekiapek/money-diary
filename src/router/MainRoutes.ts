const MainRoutes = {
    path: "/main",
    meta: {
        requiresAuth: true,
    },
    redirect: "/main",
    component: () => import("@/layouts/full/FullLayout.vue"),
    children: [
        {
            name: "Dashboard",
            path: "/",
            component: () => import("@/views/dashboard/index.vue"),
        },
        {
            name: "Category",
            path: "/category",
            component: () => import("@/views/pages/Category/Category.vue")
        },
        {
            name: "Wallet",
            path: "/wallet",
            component: () => import("@/views/pages/Wallet/Wallet.vue")
        },
        {
            name: "Transaction",
            path: "/transaction",
            component: () => import("@/views/pages/Transaction/Transaction.vue")
        },
    ]
};

export default MainRoutes;

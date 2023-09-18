const MainRoutes = {
    path: '/main',
    meta: {
        requiresAuth: true,
    },
    redirect: '/main',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        {
            name: 'Dashboard',
            path: '/',
            component: () => import('@/views/dashboard/index.vue'),
        },
        {
            name: 'Typography',
            path: '/ui/typography',
            component: () => import('@/views/components/Typography.vue')
        },
        {
            name: 'Shadow',
            path: '/ui/shadow',
            component: () => import('@/views/components/Shadow.vue')
        },
        {
            name: 'Icons',
            path: '/icons',
            component: () => import('@/views/pages/Icons.vue')
        },
        {
            name: 'Category',
            path: '/category',
            component: () => import('@/views/pages/Category/Category.vue')
        },
        {
            name: 'Wallet',
            path: '/wallet',
            component: () => import('@/views/pages/Wallet/Wallet.vue')
        },
    ]
};

export default MainRoutes;

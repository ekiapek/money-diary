import {
    FileDollarIcon,WalletIcon,HomeIcon,PigMoneyIcon, ChartLineIcon, CategoryIcon
} from 'vue-tabler-icons';

export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
}

const sidebarItem: menu[] = [
    
    {
        title: 'Home',
        icon: HomeIcon,
        to: '/',
    },
    {
        title: 'Transactions',
        icon: FileDollarIcon,
        to: '/transaction'
    },
    {
        title: 'Wallets',
        icon: WalletIcon,
        to: '/wallet'
    },
    // {
    //     title: 'Budget',
    //     icon: PigMoneyIcon,
    //     to: ''
    // },
    // {
    //     title: 'Financial Plan',
    //     icon: ChartLineIcon,
    //     to: ''
    // },
    {
        title: 'Manage Categories',
        icon: CategoryIcon,
        to: '/category'
    },
];

export default sidebarItem;

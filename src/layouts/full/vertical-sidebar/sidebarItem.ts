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
    // { header: 'Home' },
    {
        title: 'Home',
        icon: HomeIcon,
        to: '/',
    },
    // { header: 'diary' },
    {
        title: 'Transactions',
        icon: FileDollarIcon,
        to: '/ui/typography'
    },
    // { header: 'wallets' },
    {
        title: 'Wallets',
        icon: WalletIcon,
        to: '/wallet'
    },
    {
        title: 'Budget',
        icon: PigMoneyIcon,
        to: ''
    },
    {
        title: 'Financial Plan',
        icon: ChartLineIcon,
        to: ''
    },
    {
        title: 'Manage Categories',
        icon: CategoryIcon,
        to: '/category'
    },
    // { header: 'utilities' },
    // {
    //     title: 'Typography',
    //     icon: TypographyIcon,
    //     to: '/ui/typography'
    // },
    // {
    //     title: 'Shadow',
    //     icon: CopyIcon,
    //     to: '/ui/shadow'
    // },
    // { header: 'auth' },
    // {
    //     title: 'Login',
    //     icon: LoginIcon,
    //     to: '/auth/login'
    // },
    // {
    //     title: 'Register',
    //     icon: UserPlusIcon,
    //     to: '/auth/register'
    // },
    // { header: 'Extra' },
    // {
    //     title: 'Icons',
    //     icon: MoodHappyIcon,
    //     to: '/icons'
    // },
    // {
    //     title: 'Sample Page',
    //     icon: ApertureIcon,
    //     to: '/sample-page'
    // },
];

export default sidebarItem;

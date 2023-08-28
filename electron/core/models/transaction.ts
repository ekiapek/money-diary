export interface Transaction {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    amount: number;
    type: number;
    walletId: string;
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}
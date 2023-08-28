export interface Wallet {
    id: string;
    name: string;
    description: string;
    balance: number;
    icon: string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}
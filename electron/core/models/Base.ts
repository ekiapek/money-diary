export type Base = {
    id?: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
}
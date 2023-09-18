export function formatCurrency(number:number, currency: string){
    return Intl.NumberFormat('id-ID',{ style: 'currency', currency: currency }).format(number);
}
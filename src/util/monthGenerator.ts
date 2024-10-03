import dayjs from "dayjs";

export function generateMonths(minDate:Date, maxDate:Date): any[]{
    let months:any[] = [];
    let max = dayjs(maxDate);
    let min = dayjs(minDate);
    while(max.isAfter(min) && months.length <= 12) {
        let monthString = max.format('MMMM YYYY')
        let m = {
            date: max.toDate(),
            str: monthString
        }
        months.push(m)
        
        max = max.subtract(1,'month')
    }
    
    return months
}
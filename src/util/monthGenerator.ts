import dayjs from "dayjs";

export function generateMonths(minDate:Date, maxDate:Date): any[]{
    let months:any[] = [];
    let current = dayjs(maxDate);
    let min = dayjs(minDate);
    while(current.isAfter(min)) {
        let monthString = current.format('MMMM YYYY')
        let m = {
            date: current.toDate(),
            str: monthString
        }
        months.push(m)
        
        current = current.subtract(1,'month')
        
    }
    
    return months
}
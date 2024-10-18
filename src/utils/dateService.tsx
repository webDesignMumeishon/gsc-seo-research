import moment from "moment";

export type YYYYMMDD = `${string}-${string}-${string}`;

class DateService {
    static getDaysRange(days: number) {
        const today = moment();
        const pastDate = moment().subtract(days, 'days');
        return {
            from: pastDate.toDate(),
            to: today.toDate(),
        };
    }

    static formatDateYYYYMMDD(date: Date) {
        return moment(date).format('YYYY-MM-DD') as YYYYMMDD;
    }
}

export default DateService
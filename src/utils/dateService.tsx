import moment from "moment";

class DateService {
    static getDaysRange(days: number) {
        const today = moment();
        const pastDate = moment().subtract(days, 'days');
        return {
            from: pastDate.toDate(),
            to: today.toDate(),
        };
    }
}

export default DateService
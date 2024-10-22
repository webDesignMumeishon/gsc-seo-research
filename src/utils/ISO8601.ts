// YYYY-MM-DD > 2024-06-02

import moment from "moment";
import { YYYYMMDD } from "./dateService";


class ISO8601 {
    public date: YYYYMMDD

    constructor(date: YYYYMMDD) {
        this.date = date
    }

    getDay(): string {
        return this.date.split('-')[2]
    }

    getYearMonth(): string {
        return this.date.slice(0, 7)
    }

    getMonthDay() {
        return moment(this.date).format("MMM D");
    }

    static converToISO8601(date: Date) {
        return moment(date).format('YYYY-MM-DD') as YYYYMMDD;
    }
}

export default ISO8601
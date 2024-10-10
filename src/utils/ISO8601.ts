class ISO8601 {
    public date: string

    constructor(date: string) {
        this.date = date
    }

    getDay(): string {
        return this.date.split('-')[2]
    }

    getYearMonth(): string {
        return this.date.slice(0, 7)
    }
}

export default ISO8601
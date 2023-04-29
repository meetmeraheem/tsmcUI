import moment from "moment";

export const dateDuration = (year: number, month: string) => {
    try {
        const monthNumber = getMonthNumber(month);
        const date = moment(new Date(year,monthNumber,1));
        const currentDate = moment(new Date());
        const diifYears = currentDate.diff(date, 'years');
        date.add(diifYears, 'years');
        const diifMonths = currentDate.diff(date, 'months');
        return `${diifYears} Years, ${diifMonths} Months`;
    } catch (error) {
        console.log('file upload Error', error);
    }
};

const getMonthNumber = (value: string) => {
    switch (value) {
        case 'JAN':
            return 1;
        case 'FEB':
            return 2;
        case 'MAR':
            return 3;
        case 'APR':
            return 4;
        case 'MAY':
            return 5;
        case 'JUN':
            return 6;
        case 'JUL':
            return 7;
        case 'AUG':
            return 8;
        case 'SEP':
            return 9;
        case 'OCT':
            return 10;
        case 'NOV':
            return 11;
        case 'DEC':
            return 12;
        default:
            return 0;
    }
};
